import { performComprehensiveDiagnosis } from "../diagnosis/interpretation-logic-v2"

// Interface cho kết quả chẩn đoán
export interface AIDiagnosisResult {
  rawCalculation: ReturnType<typeof performComprehensiveDiagnosis>
  aiInterpretation: {
    summary: string
    mechanism: string
    symptoms: string
    timing: string
    immediateAdvice: string
    longTermTreatment: string
  }
  usedAI: boolean
  generatedAt: string
}

// Wrapper function that calls API endpoint
export async function diagnoseWithAI(
  params: {
    upperTrigram: number
    lowerTrigram: number
    movingLine: number
    healthConcern: string
    currentMonth: number
    transformedUpper: number
    transformedLower: number
  },
  retryCount = 0,
): Promise<AIDiagnosisResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // 25s client timeout
  
  try {
    const response = await fetch("/api/diagnose-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.status === 429) {
      const data = await response.json()
      const retryAfter = data.retryAfter || 60

      if (retryCount < 2) {
        console.log(`[v0] Rate limited, waiting ${retryAfter}s before retry ${retryCount + 1}/2`)
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
        return diagnoseWithAI(params, retryCount + 1)
      }

      throw new Error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`)
    }
    
    if (response.status === 503) {
      const data = await response.json()
      console.warn("[v0] Service unavailable, using fallback:", data)
      throw new Error(data.details || "Service temporarily unavailable")
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(data?.details || `API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    
    console.error("[v0] AI API call failed:", error)

    // Return graceful fallback
    return {
      rawCalculation: performComprehensiveDiagnosis(params),
      aiInterpretation: {
        summary: "Hệ thống đang phân tích dữ liệu theo Mai Hoa Dịch Số",
        mechanism:
          "Đang kết nối với hệ thống AI để phân tích chi tiết cơ chế bệnh lý và nối logic với triệu chứng của bạn",
        symptoms:
          "Vui lòng thử lại sau ít phút để nhận phân tích đầy đủ, hoặc tắt chế độ AI nâng cao để xem kết quả phân tích cơ bản",
        timing: "Đang xử lý thông tin thời điểm...",
        immediateAdvice:
          "Trong lúc chờ kết quả:\n- Theo dõi và ghi chép chi tiết triệu chứng\n- Nghỉ ngơi đầy đủ, tránh căng thẳng\n- Duy trì chế độ ăn uống cân bằng",
        longTermTreatment:
          "Sau khi có kết quả phân tích đầy đủ, hãy tham khảo chuyên gia để có phác đồ điều trị phù hợp với tình trạng của bạn.",
      },
      usedAI: false,
      generatedAt: new Date().toISOString(),
    }
  }
}

// Wrapper for simplified API
export async function getDiagnosisWithAI(params: {
  hexagramNumber: number
  upperTrigram: string
  lowerTrigram: string
  movingLine: number
  bodyElement: string
  useElement: string
  relationship: string
  healthConcern: string
  month: number
}): Promise<any> {
  const upperNum = 1
  const lowerNum = 1
  const transformedUpper = 1
  const transformedLower = 1

  try {
    const result = await diagnoseWithAI({
      upperTrigram: upperNum,
      lowerTrigram: lowerNum,
      movingLine: params.movingLine,
      healthConcern: params.healthConcern,
      currentMonth: params.month,
      transformedUpper,
      transformedLower,
    })

    return {
      summarySimple: result.aiInterpretation.summary,
      summary: result.aiInterpretation.mechanism,
      advice: `${result.aiInterpretation.immediateAdvice}\n\n${result.aiInterpretation.longTermTreatment}`,
      severity: result.rawCalculation.bodyUseAnalysis.severity,
      status: result.rawCalculation.bodyUseAnalysis.relationship,
      specificConcernAnalysis: result.aiInterpretation.symptoms,
    }
  } catch (error) {
    console.error("[v0] getDiagnosisWithAI error:", error)
    return {
      summarySimple: "Đang xử lý kết quả chẩn đoán...",
      summary: "Hệ thống đang phân tích theo Mai Hoa Dịch Số",
      advice: "Vui lòng thử lại sau",
      severity: "moderate",
      status: params.relationship,
    }
  }
}
