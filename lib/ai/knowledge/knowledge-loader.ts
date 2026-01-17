import fs from "fs"
import path from "path"

export interface KnowledgeChunk {
  id: string
  content: string
  type: "core" | "symptom" | "timing" | "treatment" | "nam-duoc"
  relevantSymptoms?: string[]
  relevantOrgans?: string[]
  servicePackage?: "mai-hoa" | "nam-duoc"
}

let knowledgeChunksCache: KnowledgeChunk[] | null = null
let knowledgeCacheTime = 0
const KNOWLEDGE_CACHE_DURATION = 30 * 60 * 1000 // 30 phút

// Mapping triệu chứng → bộ phận cơ thể
const SYMPTOM_TO_ORGANS: Record<string, string[]> = {
  "đau đầu": ["đầu", "gan", "tim", "thận"],
  "đau mắt": ["mắt", "gan", "tim"],
  "đau gối": ["gối", "gan", "thận", "tỳ"],
  "mất ngủ": ["tim", "thận", "gan"],
  "đau dạ dày": ["dạ dày", "tỳ", "gan"],
  ho: ["phổi"],
  "đau răng": ["răng", "vị", "thận"],
  "chóng mặt": ["đầu", "gan", "thận"],
  "mệt mỏi": ["tỳ", "thận", "gan"],
  sốt: ["tim", "phổi"],
}

// Mapping Ngũ Hành (Five Elements) for Nam Dược
const WU_XING_MAPPING = {
  Thủy: {
    element: "Thủy",
    organs: ["thận", "bàng quang", "tai", "xương", "tóc"],
    taste: "mặn",
    direction: "Bắc",
    season: "Đông",
    climate: "Lạnh",
  },
  Mộc: {
    element: "Mộc",
    organs: ["can", "gan", "mật", "mắt", "gân", "móng"],
    taste: "chua",
    direction: "Đông",
    season: "Xuân",
    climate: "Gió",
  },
  Kim: {
    element: "Kim",
    organs: ["phế", "phổi", "đại tràng", "mũi", "da", "lông"],
    taste: "cay",
    direction: "Tây",
    season: "Thu",
    climate: "Khô",
  },
  Hỏa: {
    element: "Hỏa",
    organs: ["tâm", "tim", "tiểu tràng", "lưỡi", "mạch"],
    taste: "đắng",
    direction: "Nam",
    season: "Hè",
    climate: "Nóng",
  },
  Thổ: {
    element: "Thổ",
    organs: ["tỳ", "vị", "miệng", "môi", "cơ"],
    taste: "ngọt",
    direction: "Trung ương",
    season: "Tứ mùa",
    climate: "Ẩm",
  },
}

export function parseKnowledgeBase(): KnowledgeChunk[] {
  const now = Date.now()

  // Sử dụng cache nếu còn hiệu lực
  if (knowledgeChunksCache && now - knowledgeCacheTime < KNOWLEDGE_CACHE_DURATION) {
    return knowledgeChunksCache
  }

  try {
    const knowledgePath = path.join(process.cwd(), "lib/ai/knowledge")
    const maiHoaCore = fs.readFileSync(path.join(knowledgePath, "mai-hoa-core.md"), "utf-8")
    const symptomAnalysis = fs.readFileSync(path.join(knowledgePath, "symptom-analysis.md"), "utf-8")
    const anthropometricRules = fs.readFileSync(path.join(knowledgePath, "anthropometric-rules.md"), "utf-8")
    const namDuocThanHieu = fs.readFileSync(path.join(knowledgePath, "nam-duoc-than-hieu.md"), "utf-8")

    const chunks: KnowledgeChunk[] = []

    // Chunk 1: Core logic (luôn cần) - Mai Hoa
    const coreSection = extractSection(maiHoaCore, "LOGIC CHẨN ĐOÁN CỐT LÕI", "8 QUẺ THUẦN VÀ BỘ PHẬN")
    chunks.push({
      id: "core-logic",
      content: coreSection,
      type: "core",
      servicePackage: "mai-hoa",
    })

    chunks.push({
      id: "anthropometric-rules",
      content: anthropometricRules,
      type: "core",
      servicePackage: "mai-hoa",
    })

    const namDuocWuXing = [
      { element: "Thủy", organs: ["thận", "bàng quang", "tai"], marker: "## I. HÀNH THỦY" },
      { element: "Mộc", organs: ["can", "mật", "mắt", "gân"], marker: "## II. HÀNH MỘC" },
      { element: "Kim", organs: ["phế", "đại tràng", "mũi", "da"], marker: "## III. HÀNH KIM" },
      { element: "Hỏa", organs: ["tâm", "tim", "tiểu tràng", "lưỡi"], marker: "## IV. HÀNH HỎA" },
      { element: "Thổ", organs: ["tỳ", "vị", "miệng"], marker: "## V. HÀNH THỔ" },
    ]

    namDuocWuXing.forEach((wuxing) => {
      const section = extractSectionByMarker(namDuocThanHieu, wuxing.marker)
      if (section) {
        chunks.push({
          id: `nam-duoc-${wuxing.element.toLowerCase()}`,
          content: section,
          type: "nam-duoc",
          relevantOrgans: wuxing.organs,
          servicePackage: "nam-duoc",
        })
      }
    })

    const herbCatalog = extractSection(namDuocThanHieu, "DANH MỤC THUỐC NAM", "## I. HÀNH THỦY")
    if (herbCatalog) {
      chunks.push({
        id: "nam-duoc-catalog",
        content: herbCatalog,
        type: "nam-duoc",
        servicePackage: "nam-duoc",
      })
    }

    // Chunk 2: 8 quẻ thuần (chia nhỏ theo quẻ) - Mai Hoa
    const trigramSections = [
      { name: "Càn", organs: ["đầu", "xương", "phổi", "đại tràng"] },
      { name: "Đoài", organs: ["miệng", "họng", "phổi"] },
      { name: "Ly", organs: ["mắt", "tim", "ruột non"] },
      { name: "Chấn", organs: ["chân", "gan", "mật"] },
      { name: "Tốn", organs: ["tay", "gan", "ruột"] },
      { name: "Khảm", organs: ["tai", "thận", "bàng quang"] },
      { name: "Cấn", organs: ["tay", "mũi", "tỳ", "vị"] },
      { name: "Khôn", organs: ["bụng", "tỳ", "dạ dày"] },
    ]

    trigramSections.forEach((trigram) => {
      const section = extractTrigramSection(maiHoaCore, trigram.name)
      if (section) {
        chunks.push({
          id: `trigram-${trigram.name}`,
          content: section,
          type: "core",
          relevantOrgans: trigram.organs,
          servicePackage: "mai-hoa",
        })
      }
    })

    // Chunk 3: Phân tích theo mùa - Mai Hoa
    const timingSection = extractSection(maiHoaCore, "PHÂN TÍCH THEO MÙA", "THỜI ĐIỂM HỒI PHỤC")
    chunks.push({
      id: "timing",
      content: timingSection,
      type: "timing",
      servicePackage: "mai-hoa",
    })

    // Chunk 4: Phân tích triệu chứng cụ thể - Mai Hoa
    const symptomSections = ["ĐAU ĐẦU", "ĐAU ĐẦU GỐI", "MẤT NGỦ", "ĐAU DẠ DÀY", "HO KHAN", "ĐAU RĂNG"]

    symptomSections.forEach((symptom) => {
      const section = extractSymptomSection(symptomAnalysis, symptom)
      if (section) {
        chunks.push({
          id: `symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`,
          content: section,
          type: "symptom",
          relevantSymptoms: [symptom.toLowerCase()],
          servicePackage: "mai-hoa",
        })
      }
    })

    knowledgeChunksCache = chunks
    knowledgeCacheTime = now

    console.log(
      `[v0] Knowledge base parsed: ${chunks.length} chunks (${chunks.filter((c) => c.servicePackage === "nam-duoc").length} Nam Dược chunks)`,
    )

    return chunks
  } catch (error) {
    console.error("[v0] Failed to parse knowledge base:", error)
    return []
  }
}

export function selectRelevantChunks(
  healthConcern: string,
  affectedOrgans: string[],
  hasAnthropometricData = false,
  maxTokens = 2000,
  servicePackage: "mai-hoa" | "nam-duoc" | "both" = "mai-hoa",
): string {
  const chunks = parseKnowledgeBase()
  const selected: KnowledgeChunk[] = []

  const filteredChunks = chunks.filter((c) => {
    if (servicePackage === "both") return true
    return !c.servicePackage || c.servicePackage === servicePackage
  })

  if (servicePackage === "nam-duoc" || servicePackage === "both") {
    // Thêm catalog tóm tắt (chỉ có tên thuốc, công dụng chính)
    const catalogChunk = filteredChunks.find((c) => c.id === "nam-duoc-catalog")
    if (catalogChunk) {
      // Rút gọn catalog - chỉ lấy tên thuốc và công dụng chính
      const summarizedCatalog = summarizeHerbCatalog(catalogChunk.content)
      selected.push({
        ...catalogChunk,
        content: summarizedCatalog,
      })
    }

    // Tìm các hành (elements) liên quan đến cơ quan bị ảnh hưởng
    const relevantWuXingChunks = filteredChunks
      .filter(
        (c) =>
          c.type === "nam-duoc" &&
          c.id !== "nam-duoc-catalog" &&
          c.relevantOrgans?.some((organ) => affectedOrgans.some((a) => a.includes(organ))),
      )
      .sort((a, b) => {
        // Ưu tiên chunk có nhiều cơ quan liên quan nhất
        const aScore = a.relevantOrgans?.filter((organ) => affectedOrgans.some((a) => a.includes(organ))).length || 0
        const bScore = b.relevantOrgans?.filter((organ) => affectedOrgans.some((a) => a.includes(organ))).length || 0
        return bScore - aScore
      })

    // Chỉ lấy tối đa 2 hành để tiết kiệm token
    relevantWuXingChunks.slice(0, 2).forEach((c) => selected.push(c))
  }

  if (servicePackage === "mai-hoa" || servicePackage === "both") {
    // Luôn thêm core logic cho Mai Hoa
    const coreChunk = filteredChunks.find((c) => c.id === "core-logic")
    if (coreChunk) selected.push(coreChunk)

    if (hasAnthropometricData) {
      const anthropometricChunk = filteredChunks.find((c) => c.id === "anthropometric-rules")
      if (anthropometricChunk) selected.push(anthropometricChunk)
    }

    // Thêm chunks liên quan đến triệu chứng
    const concernLower = healthConcern.toLowerCase()
    const relevantSymptomKeywords = Object.keys(SYMPTOM_TO_ORGANS).filter((keyword) => concernLower.includes(keyword))

    // Thêm symptom analysis cho triệu chứng cụ thể
    filteredChunks
      .filter(
        (c) =>
          c.type === "symptom" && c.relevantSymptoms?.some((s) => relevantSymptomKeywords.some((k) => s.includes(k))),
      )
      .forEach((c) => selected.push(c))

    // Thêm trigram chunks liên quan đến cơ quan bị ảnh hưởng
    filteredChunks
      .filter(
        (c) => c.type === "core" && c.relevantOrgans?.some((organ) => affectedOrgans.some((a) => a.includes(organ))),
      )
      .forEach((c) => {
        if (!selected.includes(c)) selected.push(c)
      })

    // Thêm timing nếu còn chỗ
    const timingChunk = filteredChunks.find((c) => c.type === "timing")
    if (timingChunk && !selected.includes(timingChunk)) {
      selected.push(timingChunk)
    }
  }

  let combined = selected.map((c) => c.content).join("\n\n")

  const estimatedTokens = combined.length / 3
  if (estimatedTokens > maxTokens) {
    // Tính toán chính xác số ký tự cần giữ lại
    const targetLength = maxTokens * 3
    combined = combined.substring(0, targetLength) + "\n\n[...đã rút gọn để tiết kiệm token]"
  }

  console.log(
    `[v0] Knowledge chunks selected: ${selected.length} chunks, estimated tokens: ${Math.ceil(combined.length / 3)}, package: ${servicePackage}`,
  )

  return combined
}

export function getElementFromOrgans(affectedOrgans: string[]): string[] {
  const elements: Set<string> = new Set()

  Object.entries(WU_XING_MAPPING).forEach(([element, data]) => {
    if (data.organs.some((organ) => affectedOrgans.some((a) => a.includes(organ)))) {
      elements.add(element)
    }
  })

  return Array.from(elements)
}

// Helper functions
function extractSection(content: string, startMarker: string, endMarker: string): string {
  const startIndex = content.indexOf(startMarker)
  const endIndex = content.indexOf(endMarker, startIndex)

  if (startIndex === -1) return ""
  if (endIndex === -1) return content.substring(startIndex)

  return content.substring(startIndex, endIndex).trim()
}

function extractSectionByMarker(content: string, marker: string): string {
  const regex = new RegExp(
    `${marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?(?=##\\s+[IVX]+\\.\\s+HÀNH|$)`,
    "i",
  )
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function extractTrigramSection(content: string, trigramName: string): string {
  const regex = new RegExp(`###\\s*\\d+\\.\\s*Quẻ ${trigramName}[\\s\\S]*?(?=###|$)`, "i")
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function extractSymptomSection(content: string, symptomName: string): string {
  const regex = new RegExp(`##\\s*${symptomName}[\\s\\S]*?(?=##|$)`, "i")
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function summarizeHerbCatalog(catalogContent: string): string {
  // Chỉ giữ lại: Mã thuốc, Tên, Công dụng chính (bỏ chi tiết)
  const lines = catalogContent.split("\n")
  const summarized: string[] = []

  lines.forEach((line) => {
    // Giữ header
    if (line.startsWith("#") || line.startsWith("**Mã") || line.startsWith("**Tên") || line.trim() === "") {
      summarized.push(line)
    }
    // Chỉ giữ dòng chứa mã thuốc và công dụng ngắn gọn
    else if (line.match(/^[TMKHFTH]\d{3}/)) {
      const parts = line.split(":")
      if (parts.length >= 2) {
        // Cắt bớt mô tả dài, chỉ giữ 100 ký tự đầu
        const shortDesc = parts.slice(1).join(":").trim().substring(0, 100) + "..."
        summarized.push(`${parts[0]}: ${shortDesc}`)
      }
    }
  })

  return summarized.join("\n")
}
