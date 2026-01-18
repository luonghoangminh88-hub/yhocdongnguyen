import { getTrigramByNumber } from "./data/trigram-data"
import { getHexagramByTrigrams } from "./data/hexagram-data"

export interface NamDuocHerb {
  code: string // T001, M001, K001, H001, TH001
  name: string // Vietnamese name
  taste: string // Vị: mặn, chua, cay, đắng, ngọt
  nature: string // Tính: hàn, lương, bình, ôn, nóng
  element: string // Thủy, Mộc, Kim, Hỏa, Thổ
  organ: string // Thận, Can, Phế, Tâm, Tỳ
  effects: string // Chủ trị
  notes?: string // Ghi chú đặc biệt
}

export interface NamDuocPrescription {
  name: string
  indication: string
  analysis?: string // Phân tích từ quẻ dịch sang bài thuốc
  formula: {
    herb: NamDuocHerb
    amount: string
    role: "Quân" | "Thần" | "Tá" | "Sứ" // Traditional formula hierarchy
  }[]
  preparation: string[]
  dosage: string
  duration: string
  precautions: string[]
}

// Five Elements herb database from Nam Duoc Than Hieu
const NAM_DUOC_HERBS: Record<string, NamDuocHerb> = {
  // THỦY (Water) - Salty taste, Kidney organ
  T001: {
    code: "T001",
    name: "Muối ăn (Phác tiêu)",
    taste: "Mặn",
    nature: "Hàn",
    element: "Thủy",
    organ: "Thận",
    effects: "Tả hỏa, sát trùng, nhuận tràng, trị đau họng, chảy máu răng",
    notes: "Liều nhỏ dẫn thuốc vào Thận, liều lớn gây nôn/tẩy",
  },
  T002: {
    code: "T002",
    name: "Mẫu lệ (Vỏ hàu)",
    taste: "Mặn",
    nature: "Hơi hàn",
    element: "Thủy",
    organ: "Thận",
    effects: "Tư âm, tiềm dương, trị mồ hôi trộm, di tinh, tràng nhạc",
    notes: "Làm mềm các khối cứng (nhuyễn kiên)",
  },
  T003: {
    code: "T003",
    name: "Thạch quyết minh (Vỏ bào ngư)",
    taste: "Mặn",
    nature: "Bình",
    element: "Thủy",
    organ: "Thận",
    effects: "Sáng mắt, trị cao huyết áp, chóng mặt, hoa mắt do can dương vượng",
    notes: "Bình can, tiềm dương cho người lớn tuổi",
  },
  T006: {
    code: "T006",
    name: "Ba kích (Thiên kích)",
    taste: "Cay ngọt (hơi mặn)",
    nature: "Ấm",
    element: "Thủy",
    organ: "Thận",
    effects: "Bổ thận dương, mạnh gân cốt, trị liệt dương, di tinh, phong thấp",
    notes: "Thuốc hàng đầu bồi bổ thận khí nam giới",
  },
  T007: {
    code: "T007",
    name: "Đỗ trọng",
    taste: "Hơi mặn/ngọt",
    nature: "Ấm",
    element: "Thủy",
    organ: "Thận",
    effects: "Bổ gan thận, khỏe gân cốt, an thai, trị đau lưng mỏi gối",
    notes: "Thuốc chủ đạo trong bài thuốc xương khớp",
  },
  T009: {
    code: "T009",
    name: "Trạch tả",
    taste: "Ngọt/mặn",
    nature: "Hàn",
    element: "Thủy",
    organ: "Thận",
    effects: "Lợi tiểu, thanh nhiệt, trị thủy thũng, đái dắt, tiêu chảy",
    notes: "Đào thải thấp nhiệt qua đường bài tiết",
  },

  // MỘC (Wood) - Sour taste, Liver organ
  M003: {
    code: "M003",
    name: "Mộc qua",
    taste: "Chua",
    nature: "Ôn",
    element: "Mộc",
    organ: "Can",
    effects: "Trị đau nhức khớp xương, co quắp gân thịt, chân tay yếu mỏi",
    notes: "Hoạt huyết, thông kinh lạc, tốt cho gân (Can chủ cân)",
  },
  M004: {
    code: "M004",
    name: "Kim anh tử",
    taste: "Chua chát",
    nature: "Bình",
    element: "Mộc",
    organ: "Can",
    effects: "Trị di tinh, mộng tinh, tiểu đêm nhiều lần, tỳ hư đi lỵ",
    notes: "Tính thu liễm cực mạnh, giữ gìn tinh khí",
  },
  M006: {
    code: "M006",
    name: "Thược dược (Bạch thược)",
    taste: "Chua đắng",
    nature: "Hơi hàn",
    element: "Mộc",
    organ: "Can",
    effects: "Dưỡng huyết, nhuận gan, trị đau bụng, kinh nguyệt không đều",
    notes: "Làm dịu sự nóng nảy của Can hỏa",
  },
  M008: {
    code: "M008",
    name: "Dâu quả (Tang thầm)",
    taste: "Chua ngọt",
    nature: "Hàn",
    element: "Mộc",
    organ: "Can",
    effects: "Bổ gan thận, sáng mắt, trị tóc bạc sớm, mất ngủ",
    notes: "Dưỡng âm, bổ huyết cho Can kinh",
  },
  M010: {
    code: "M010",
    name: "Ngũ vị tử",
    taste: "Chua (đủ 5 vị)",
    nature: "Ấm",
    element: "Mộc",
    organ: "Can",
    effects: "Bổ thận, liễm phế, trị ho suyễn, di tinh, háo khát",
    notes: "Vị chua giúp gom giữ khí tán loạn",
  },

  // KIM (Metal) - Pungent taste, Lung organ
  K001: {
    code: "K001",
    name: "Gừng sống (Sinh khương)",
    taste: "Cay",
    nature: "Ấm",
    element: "Kim",
    organ: "Phế",
    effects: "Trị ho, tiêu đờm, tán hàn, giải cảm, chữa đầy bụng nôn mửa",
    notes: "Thuốc phổ biến nhất để phát tán phong hàn",
  },
  K002: {
    code: "K002",
    name: "Bạc hà",
    taste: "Cay",
    nature: "Mát (lương)",
    element: "Kim",
    organ: "Phế",
    effects: "Trị cảm phong nhiệt, đau đầu, đau mắt đỏ, họng sưng đau",
    notes: "Tính chất thăng phù, đưa thuốc lên phần trên cơ thể",
  },
  K003: {
    code: "K003",
    name: "Tía tô (Tử tô)",
    taste: "Cay",
    nature: "Ấm",
    element: "Kim",
    organ: "Phế",
    effects: "Trị ngoại cảm phong hàn, sốt, không ra mồ hôi, an thai",
    notes: "Lá để giải cảm, cành (Tô ngạnh) để an thai",
  },
  K004: {
    code: "K004",
    name: "Kinh giới",
    taste: "Cay",
    nature: "Ấm",
    element: "Kim",
    organ: "Phế",
    effects: "Trị phong ngứa, mụn nhọt, cầm máu (khi sao cháy), cảm mạo",
    notes: "Thánh dược trị các bệnh về phong ngoài da",
  },
  K008: {
    code: "K008",
    name: "Cát cánh",
    taste: "Đắng/cay",
    nature: "Bình",
    element: "Kim",
    organ: "Phế",
    effects: "Chữa ho có đờm, họng sưng đau, nôn ra mủ (phế ung)",
    notes: "Dẫn thuốc đi thẳng vào Phế",
  },

  // HỎA (Fire) - Bitter taste, Heart organ
  H001: {
    code: "H001",
    name: "Tâm sen (Liên tâm)",
    taste: "Đắng",
    nature: "Hàn",
    element: "Hỏa",
    organ: "Tâm",
    effects: "Thanh tâm hỏa, an thần, trị mất ngủ, di tinh, hạ huyết áp",
    notes: "Dập tắt hỏa ở Tâm, giúp ngủ ngon",
  },
  H003: {
    code: "H003",
    name: "Hoàng liên",
    taste: "Đắng",
    nature: "Hàn",
    element: "Hỏa",
    organ: "Tâm",
    effects: "Tả hỏa ở tâm và tỳ, trị lỵ, nôn mửa, miệng lưỡi lở loét",
    notes: "Thuốc đầu bảng để thanh nhiệt tiêu độc",
  },
  H004: {
    code: "H004",
    name: "Ngải cứu",
    taste: "Đắng",
    nature: "Ấm (ôn)",
    element: "Hỏa",
    organ: "Tâm",
    effects: "Điều kinh, an thai, cầm máu, trị đau bụng do lạnh",
    notes: "Dù vị đắng nhưng tính ấm, dùng để ôn thông kinh mạch",
  },
  H005: {
    code: "H005",
    name: "Hạt muồng (Thảo quyết minh)",
    taste: "Đắng/ngọt",
    nature: "Hơi hàn",
    element: "Hỏa",
    organ: "Tâm",
    effects: "Sáng mắt, nhuận tràng, trị đau đầu, mất ngủ, táo bón",
    notes: "Sao cháy tăng tác dụng an thần, dẫn vào tâm kinh",
  },
  H008: {
    code: "H008",
    name: "Dành dành (Chi tử)",
    taste: "Đắng",
    nature: "Hàn",
    element: "Hỏa",
    organ: "Tâm",
    effects: "Thanh nhiệt ở tam tiêu, trị tâm phiền, mất ngủ, bí tiểu",
    notes: "Hạ sốt và giải tỏa sự bứt rứt trong lòng",
  },

  // THỔ (Earth) - Sweet taste, Spleen organ
  TH001: {
    code: "TH001",
    name: "Cam thảo (Nam cam thảo)",
    taste: "Ngọt",
    nature: "Bình",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Giải độc, điều hòa các vị thuốc, trị ho, đau họng, kiện tỳ",
    notes: "Quốc lão trong giới y học, giúp hòa hợp các vị khác",
  },
  TH002: {
    code: "TH002",
    name: "Củ mài (Hoài sơn)",
    taste: "Ngọt",
    nature: "Bình",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Bổ tỳ vị, ích thận, trị tiêu chảy lâu ngày, di tinh, háo khát",
    notes: "Vị thuốc quý để bồi bổ trung châu (tỳ vị)",
  },
  TH003: {
    code: "TH003",
    name: "Ý dĩ (Bo bo)",
    taste: "Ngọt",
    nature: "Hơi hàn",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Kiện tỳ, lợi thấp, trị đau nhức xương khớp, tiêu chảy, phù thũng",
    notes: "Trừ thấp nhiệt, làm nhẹ người, mạnh gân cốt",
  },
  TH004: {
    code: "TH004",
    name: "Mật ong (Phong mật)",
    taste: "Ngọt",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Bổ trung, nhuận táo, giải độc, trị đau dạ dày, táo bón",
    notes: "Vị thuốc bổ dưỡng hàng đầu, làm lành vết thương",
  },
  TH006: {
    code: "TH006",
    name: "Hạt sen (Liên nhục)",
    taste: "Ngọt",
    nature: "Bình",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Kiện tỳ, an thần, trị tiêu chảy, mất ngủ, di mộng tinh",
    notes: "Vừa bổ tỳ vừa định tâm, giúp tiêu hóa tốt và ngủ ngon",
  },
  TH007: {
    code: "TH007",
    name: "Long nhãn",
    taste: "Ngọt",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Bổ tâm tỳ, dưỡng huyết, an thần, trị trí nhớ kém, lo âu",
    notes: "Vị ngọt đậm đà, bồi bổ cho người suy nhược",
  },
  TH008: {
    code: "TH008",
    name: "Đậu đen (Hắc đậu)",
    taste: "Ngọt",
    nature: "Bình",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Giải độc, bổ thận, lợi thủy, trị đau lưng, mụn nhọt",
    notes: "Sao cháy để dẫn thuốc vào thận (Thủy thổ hợp hóa)",
  },
  TH009: {
    code: "TH009",
    name: "Hoàng kỳ",
    taste: "Ngọt",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Bổ khí, thăng dương, cố biểu, trị sa dạ dày, mệt mỏi, đổ mồ hôi",
    notes: "Vị thuốc hàng đầu để bổ khí, giúp nâng các tạng bị sa",
  },
  TH010: {
    code: "TH010",
    name: "Nhân sâm",
    taste: "Ngọt",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Đại bổ nguyên khí, sanh tân, an thần, trị suy nhược, kiệt sức",
    notes: "Vua của các vị bổ, sinh lực mạnh mẽ nhất",
  },
  TH011: {
    code: "TH011",
    name: "Bạch truật",
    taste: "Ngọt/đắng",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Kiện tỳ, táo thấp, cố biểu, an thai, trị tiêu chảy, mệt mỏi",
    notes: "Thuốc chủ để kiện tỳ, làm khô thấp khí",
  },
  TH012: {
    code: "TH012",
    name: "Thăng ma",
    taste: "Cay/ngọt",
    nature: "Ấm",
    element: "Thổ",
    organ: "Tỳ",
    effects: "Thăng dương, giải biểu, trị đau đầu, sa cơ quan, thoái hóa cột sống",
    notes: "Giúp nâng thanh khí lên, đẩy thuốc lên đầu",
  },
}

// Map hexagram to affected organs and select appropriate herbs
export function selectHerbsByHexagram(
  upperTrigram: number,
  lowerTrigram: number,
  movingLine: number,
): {
  primaryElement: string
  affectedOrgans: string[]
  selectedHerbs: NamDuocHerb[]
} {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  const primaryElement = upper.element
  const affectedOrgans = [upper.organ, lower.organ]

  // Select herbs based on Five Elements theory
  const selectedHerbs: NamDuocHerb[] = []

  // Add herbs for primary affected organ (upper trigram)
  const primaryHerbs = Object.values(NAM_DUOC_HERBS).filter((herb) => herb.organ === upper.organ)
  selectedHerbs.push(...primaryHerbs.slice(0, 2)) // Top 2 herbs for primary organ

  // Add herbs for secondary affected organ (lower trigram)
  const secondaryHerbs = Object.values(NAM_DUOC_HERBS).filter((herb) => herb.organ === lower.organ)
  selectedHerbs.push(...secondaryHerbs.slice(0, 1)) // Top 1 herb for secondary organ

  // Add harmonizing herb (Cam thao - universal harmonizer)
  const harmonizer = NAM_DUOC_HERBS.TH001
  if (!selectedHerbs.includes(harmonizer)) {
    selectedHerbs.push(harmonizer)
  }

  return {
    primaryElement,
    affectedOrgans,
    selectedHerbs,
  }
}

// Fixed prescription mapping for specific hexagrams (from Nam Duoc database)
const FIXED_PRESCRIPTIONS: Record<string, NamDuocPrescription> = {
  "7_8": {
    name: "Bổ Trung Ích Khí Thang",
    indication: "Trị sa dạ dày, cơ nhục yếu bủng, khí hư mệt mỏi",
    analysis: `**Quẻ Sơn Địa Bác** cho thấy sự suy yếu dần của chính khí, mất mát nguyên khí trong người.

**NỘI QUẺ (KHÔN - ĐỊA):** Khí Thể - Tạng Tỵ

Chủ về vận hóa, tiêu hóa trung tiêu. Khôn thuộc Thổ, hợp với Tỳ tạng. Khi suy yếu, chức năng vận hóa không tốt, tiêu mòn chính khí. Trong cơ thể biểu hiện: Tỵ Hư Nhuộc, khí thể bị đình trệ, bụng đầy trướng, ăn uống không ngon.

**NGOẠI QUẺ (CẤN - SƠN):** Khí Thể - Vị (Dạ dày)

Chủ về tiếp thu ẩm thực. Khi Vì khí uất trệ, đình trệ, gây biểu hiện Tỵ Vị Hư Nhuộc, khí thể yếu kém, ăn uống không tiêu, bụng đầy trướng, mệt mỏi.

**KẾT LUẬN:** Quẻ Bác thể hiện tình trạng Tỵ Vị suy yếu dần, mất mát nguyên khí. Người bệnh thường mệt mỏi, ăn uống không ngon miệng, khó tiêu hóa, thậm chí có thể dẫn đến sa dạ dày, sa tử cung. 

**Bổ Trung Ích Khí Thang** được chọn để bổ dưỡng Trung Tiêu (Tỳ Vị), nâng Dương khí bị suy hãm, cải thiện chức năng tiêu hóa và hồi phục nguyên khí cho cơ thể.`,
    formula: [
      { herb: NAM_DUOC_HERBS.TH009, amount: "15-20g", role: "Quân" }, // Hoàng kỳ
      { herb: NAM_DUOC_HERBS.TH010, amount: "10g", role: "Thần" }, // Nhân sâm
      { herb: NAM_DUOC_HERBS.TH011, amount: "10g", role: "Tá" }, // Bạch truật
      { herb: NAM_DUOC_HERBS.TH012, amount: "6-9g", role: "Sứ" }, // Thăng ma
    ],
    preparation: [
      "Rửa sạch các vị thuốc, ngâm trong nước lạnh 20-30 phút",
      "Đun sôi với 800ml nước, sau đó hạ lửa nhỏ",
      "Sắc trong 35-45 phút đến khi còn 300-350ml",
      "Lọc bỏ bã, chia làm 2 lần uống",
    ],
    dosage: "Uống 150-175ml mỗi lần, sáng và tối sau ăn 30 phút",
    duration: "Liên tục trong 2-4 tuần, tái khám nếu không cải thiện",
    precautions: [
      "Uống sau khi ăn để tránh khó tiêu",
      "Tránh ăn thực phẩm cay nóng, dầu mỡ trong thời gian dùng thuốc",
      "Nghỉ ngơi đầy đủ, tránh căng thắng",
      "Nên tham khảo ý kiến thầy thuốc trước khi dùng",
    ],
  },
}

// Generate prescription based on hexagram and symptoms
export function generateNamDuocPrescription(
  upperTrigram: number,
  lowerTrigram: number,
  movingLine: number,
): NamDuocPrescription {
  // Check if there's a fixed prescription for this hexagram
  const hexagramKey = `${upperTrigram}_${lowerTrigram}`
  if (FIXED_PRESCRIPTIONS[hexagramKey]) {
    return FIXED_PRESCRIPTIONS[hexagramKey]
  }

  // Otherwise, use dynamic generation
  const { primaryElement, affectedOrgans, selectedHerbs } = selectHerbsByHexagram(
    upperTrigram,
    lowerTrigram,
    movingLine,
  )

  const hexagram = getHexagramByTrigrams(upperTrigram, lowerTrigram)
  const prescriptionName = `Bài thuốc ${hexagram?.vietnamese || "Điều trị"}`

  // Build formula with traditional hierarchy (Quân-Thần-Tá-Sứ)
  const formula = selectedHerbs.map((herb, index) => {
    let role: "Quân" | "Thần" | "Tá" | "Sứ"
    let amount: string

    if (index === 0) {
      role = "Quân" // Chief herb
      amount = "12-15g"
    } else if (index === 1) {
      role = "Thần" // Deputy herb
      amount = "10g"
    } else if (index === selectedHerbs.length - 1 && herb.code === "TH001") {
      role = "Sứ" // Envoy herb (harmonizer)
      amount = "3-6g"
    } else {
      role = "Tá" // Assistant herb
      amount = "8g"
    }

    return { herb, amount, role }
  })

  return {
    name: prescriptionName,
    indication: `Điều trị triệu chứng liên quan đến ${affectedOrgans.join(" và ")} (${primaryElement})`,
    formula,
    preparation: [
      "Rửa sạch các vị thuốc, ngâm trong nước lạnh 20-30 phút",
      "Đun sôi với 800ml nước, sau đó hạ lửa nhỏ",
      "Sắc trong 35-45 phút đến khi còn 300-350ml",
      "Lọc bỏ bã, chia làm 2 lần uống",
    ],
    dosage: "Uống 150-175ml mỗi lần, sáng và tối sau ăn 30 phút",
    duration: "Liên tục trong 2-4 tuần, tái khám nếu không cải thiện",
    precautions: [
      "Uống sau khi ăn để tránh khó tiêu",
      "Tránh ăn thực phẩm cay nóng, dầu mỡ trong thời gian dùng thuốc",
      "Nghỉ ngơi đầy đủ, tránh căng thẳng",
      "Nên tham khảo ý kiến thầy thuốc trước khi dùng",
    ],
  }
}

// Get all herbs for a specific element
export function getHerbsByElement(element: string): NamDuocHerb[] {
  return Object.values(NAM_DUOC_HERBS).filter((herb) => herb.element === element)
}

// Get all herbs for a specific organ
export function getHerbsByOrgan(organ: string): NamDuocHerb[] {
  return Object.values(NAM_DUOC_HERBS).filter((herb) => herb.organ === organ)
}
