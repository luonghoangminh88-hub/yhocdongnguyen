"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Sparkles, AlertCircle } from "lucide-react"
import { getTrigramByNumber, TRIGRAMS } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { generateDiagnosis, type DiagnosisResult } from "@/lib/diagnosis-data"
import { PaymentModal } from "@/components/payment-modal"
import { analyzeBodyUse } from "@/lib/plum-blossom-calculations"
import { ELEMENT_TO_ORGAN } from "@/lib/diagnosis/organ-mappings"
import { analyzeSeasonalInfluence } from "@/lib/diagnosis/seasonal-calculations"
import { getDetailedInterpretation } from "@/lib/diagnosis/interpretation-logic"

import { ModernDiagnosisHeader } from "./components/modern-diagnosis-header"
import { ModernSummaryCard } from "./components/modern-summary-card"
import { ModernElementsDisplay } from "./components/modern-elements-display"
import { ModernAdviceCard } from "./components/modern-advice-card"
import { SmartPackageRecommendation } from "./components/smart-package-recommendation"
import { SeasonalAnalysis } from "./components/seasonal-analysis"
import { HexagramSVG } from "@/components/hexagram-svg"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DiagnosisContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<1 | 2 | 3 | null>(null)
  const [useAI, setUseAI] = useState(true)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiResult, setAiResult] = useState<{
    rawCalculation: any
    aiInterpretation?: {
      summary: string
      mechanism: string
      symptoms: string
      timing: string
      immediateAdvice: string
      longTermTreatment: string
    }
    usedAI: boolean
    generatedAt: string
  } | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [retryAfter, setRetryAfter] = useState(0)
  const requestInFlight = useRef(false)
  const hasResult = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentRequestId = useRef<string>("")
  const [aiCompleted, setAiCompleted] = useState(false)
  const [aiFailed, setAiFailed] = useState(false)

  const upper = Number.parseInt(searchParams.get("upper") || "1")
  const lower = Number.parseInt(searchParams.get("lower") || "1")
  const moving = Number.parseInt(searchParams.get("moving") || "1")
  const healthConcern = searchParams.get("healthConcern") || ""
  const year = searchParams.get("year") || ""
  const month = searchParams.get("month") || ""
  const day = searchParams.get("day") || ""
  const hour = searchParams.get("hour") || ""
  const minute = searchParams.get("minute") || ""
  const method = searchParams.get("method") || "time"
  const gender = searchParams.get("gender") || ""
  const age = searchParams.get("age") || ""
  const painLocation = searchParams.get("painLocation") || ""
  const userLocation = searchParams.get("location") || ""

  const currentMonth = month ? Number.parseInt(month) : new Date().getMonth() + 1

  useEffect(() => {
    const result = generateDiagnosis(upper, lower, moving)
    setDiagnosis(result)
  }, [upper, lower, moving])

  const upperTrigram = getTrigramByNumber(upper)
  const lowerTrigram = getTrigramByNumber(lower)
  const hexagramData = getHexagramByTrigrams(upper, lower)

  const calculateTransformedHexagram = () => {
    if (!upperTrigram || !lowerTrigram || !moving) return null

    const isLowerMoving = moving >= 1 && moving <= 3
    const lineIndexInTrigram = isLowerMoving ? moving - 1 : moving - 4

    if (isLowerMoving) {
      const newLowerLines = [...lowerTrigram.lines]
      newLowerLines[lineIndexInTrigram] = !newLowerLines[lineIndexInTrigram]

      const newLowerTrigram = Object.values(TRIGRAMS).find((trig: any) =>
        trig?.lines?.every((line: boolean, i: number) => line === newLowerLines[i]),
      )

      if (newLowerTrigram) {
        return {
          upper: upper,
          lower: newLowerTrigram.number,
          hexagram: getHexagramByTrigrams(upper, newLowerTrigram.number),
        }
      }
    } else {
      const newUpperLines = [...upperTrigram.lines]
      newUpperLines[lineIndexInTrigram] = !newUpperLines[lineIndexInTrigram]

      const newUpperTrigram = Object.values(TRIGRAMS).find((trig: any) =>
        trig?.lines?.every((line: boolean, i: number) => line === newUpperLines[i]),
      )

      if (newUpperTrigram) {
        return {
          upper: newUpperTrigram.number,
          lower: lower,
          hexagram: getHexagramByTrigrams(newUpperTrigram.number, lower),
        }
      }
    }
    return null
  }

  const transformedHexagram = calculateTransformedHexagram()
  const bodyUseAnalysis = analyzeBodyUse(upper, lower, moving)
  const seasonalAnalysis = analyzeSeasonalInfluence(
    bodyUseAnalysis.bodyElement,
    bodyUseAnalysis.useElement,
    currentMonth,
  )

  const detailedInterpretation = getDetailedInterpretation(
    bodyUseAnalysis.bodyElement,
    bodyUseAnalysis.useElement,
    bodyUseAnalysis.relationship,
    healthConcern,
    hexagramData?.number,
    moving,
    currentMonth,
  )

  const stableBodyUseKey = useMemo(() => {
    return `${upper}-${lower}-${moving}`
  }, [upper, lower, moving])

  const stableDiagnosisKey = useMemo(() => {
    return `${healthConcern}-${currentMonth}-${stableBodyUseKey}`
  }, [healthConcern, currentMonth, stableBodyUseKey])

  const fetchAIInterpretation = async () => {
    if (requestInFlight.current) {
      console.log("[v0] Request already in flight, aborting duplicate")
      return
    }

    if (hasResult.current) {
      console.log("[v0] Already have result, skipping fetch")
      return
    }

    if (isLoadingAI) {
      console.log("[v0] Already loading, skipping fetch")
      return
    }

    if (!useAI) {
      console.log("[v0] useAI is false, skipping AI fetch")
      return
    }

    if (!upper || !lower || !moving || !healthConcern) {
      console.error("[v0] Missing required parameters:", { upper, lower, moving, healthConcern })
      return
    }

    requestInFlight.current = true
    hasResult.current = false
    setIsLoadingAI(true)
    setAiCompleted(false)
    setAiFailed(false)

    if (abortControllerRef.current) {
      console.log("[v0] Aborting previous request")
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    console.log("[v0] Starting AI interpretation fetch")

    try {
      const requestBody = {
        upperTrigram: upper,
        lowerTrigram: lower,
        movingLine: moving,
        transformedUpper: transformedHexagram?.upper || null,
        transformedLower: transformedHexagram?.lower || null,
        healthConcern,
        currentMonth,
        gender: gender || undefined,
        age: age ? Number.parseInt(age) : undefined,
        painLocation: painLocation || undefined,
        userLocation: userLocation || undefined,
      }

      console.log("[v0] Request body:", requestBody)

      const response = await fetch("/api/diagnose-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      })

      if (response.status === 429) {
        const data = await response.json()
        const retrySeconds = data.retryAfter || 60
        setRetryAfter(retrySeconds)

        const countdownInterval = setInterval(() => {
          setRetryAfter((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        setAiFailed(true)
        setAiCompleted(true)
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] AI interpretation received:", result)

      setAiResult(result)
      hasResult.current = true

      setAiCompleted(true)
      setAiFailed(!result.usedAI)

      if (!result.usedAI) {
        console.log("[v0] Backend returned fallback, not retrying")
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("[v0] Request was aborted")
      } else {
        console.error("[v0] AI interpretation failed:", error)
        setAiFailed(true)
        setAiCompleted(true)
      }
    } finally {
      setIsLoadingAI(false)
      requestInFlight.current = false
    }
  }

  useEffect(() => {
    const requestId = `${stableDiagnosisKey}-${Date.now()}`

    if (currentRequestId.current !== stableDiagnosisKey) {
      console.log("[v0] New query detected, resetting state")
      currentRequestId.current = stableDiagnosisKey
      requestInFlight.current = false
      hasResult.current = false
      setAiResult(null)
    }

    const debounceTimer = setTimeout(() => {
      if (!requestInFlight.current && !hasResult.current) {
        fetchAIInterpretation()
      }
    }, 500)

    return () => {
      clearTimeout(debounceTimer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [useAI, stableDiagnosisKey])

  const displayInterpretation = useMemo(() => {
    if (useAI && aiResult?.usedAI && aiResult.aiInterpretation) {
      const ai = aiResult.aiInterpretation

      return {
        title: detailedInterpretation.title,
        summary: ai.summary || detailedInterpretation.summary,
        summarySimple: ai.summary?.split("\n\n")[0] || detailedInterpretation.summarySimple,
        healthDetail: `${ai.mechanism}\n\n${ai.symptoms}`,
        prognosis: ai.timing || detailedInterpretation.prognosis,
        severity: detailedInterpretation.severity,
        severityLabel: detailedInterpretation.severityLabel,
        status: detailedInterpretation.status,
        immediateAdvice: ai.immediateAdvice?.split("\n") || detailedInterpretation.immediateAdvice,
        shortTermCare: ai.immediateAdvice?.split("\n").slice(0, 3) || detailedInterpretation.shortTermCare,
        longTermTreatment: ai.longTermTreatment?.split("\n") || detailedInterpretation.longTermTreatment,
        preventionTips: detailedInterpretation.preventionTips,
      }
    }

    return detailedInterpretation
  }, [useAI, aiResult, detailedInterpretation])

  const getRecommendedPackage = () => {
    const relation = bodyUseAnalysis.relationship
    if (relation.includes("khắc") && relation.includes("Dụng khắc Thể")) {
      return {
        primary: "khai-huyet",
        reason:
          "Khi Dụng khắc Thể, kinh lạc dễ bị tắc nghẽn. Khai thông huyệt đạo giúp điều hòa khí huyết hiệu quả nhất.",
        secondary: "nam-duoc",
      }
    } else if (relation.includes("khắc") && relation.includes("Thể khắc Dụng")) {
      return {
        primary: "nam-duoc",
        reason: "Thể khắc Dụng tiêu hao năng lượng. Bổ sung dược liệu thiên nhiên giúp phục hồi sinh lực nhanh chóng.",
        secondary: "tuong-so",
      }
    } else if (relation.includes("sinh") && relation.includes("Dụng sinh Thể")) {
      return {
        primary: "tuong-so",
        reason:
          "Quẻ Dụng sinh Thể, sức khỏe thuận lợi. Thời điểm này phù hợp để tìm hiểu sâu về Tượng Số nhằm tối ưu hóa năng lượng cá nhân.",
        secondary: "nam-duoc",
      }
    } else {
      return {
        primary: "nam-duoc",
        reason: "Bổ sung thảo dược phù hợp với ngũ hành của bạn giúp cân bằng cơ thể toàn diện.",
        secondary: "khai-huyet",
      }
    }
  }

  const recommendedPackage = getRecommendedPackage()

  const scrollToPackages = () => {
    const element = document.getElementById("treatment-packages")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handlePackageClick = (packageNumber: 1 | 2 | 3) => {
    setSelectedPackage(packageNumber)
    setShowPaymentModal(true)
  }

  const shouldShowContent = !useAI || aiCompleted

  if (!diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Đang phân tích kết quả chẩn đoán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Kết Quả Chẩn Đoán</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="space-y-8">
          <ModernDiagnosisHeader
            hexagramName={hexagramData?.vietnamese || `${upperTrigram?.vietnamese} ${lowerTrigram?.vietnamese}`}
            year={year}
            month={month}
            day={day}
            hour={hour}
            minute={minute}
            gender={gender}
            age={age}
            painLocation={painLocation}
            userLocation={userLocation}
          />

          {useAI && isLoadingAI && !aiCompleted && (
            <div className="flex flex-col items-center gap-4 px-8 py-12 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-primary">Đang phân tích với AI Mai Hoa Dịch Số...</p>
                <p className="text-sm text-muted-foreground">
                  Hệ thống đang xử lý thông tin của bạn với tri thức Y Dịch chuẩn xác
                </p>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {retryAfter > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-yellow-600 font-medium">
                Hệ thống đang bận, vui lòng thử lại sau {retryAfter} giây
              </p>
            </div>
          )}

          {useAI && aiResult?.usedAI && aiCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary font-medium">
                Kết quả được phân tích bởi AI với tri thức Mai Hoa Dịch Số chuẩn xác
              </p>
            </div>
          )}

          {useAI && aiFailed && aiCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-yellow-600 font-medium">
                AI tạm thời không khả dụng, sử dụng logic phân tích cơ bản
              </p>
            </div>
          )}

          {shouldShowContent && (
            <>
              <ModernSummaryCard interpretation={displayInterpretation} />

              <SmartPackageRecommendation
                severity={displayInterpretation.severity}
                status={displayInterpretation.status}
                primaryRecommendation={recommendedPackage.primary}
                reason={recommendedPackage.reason}
                onScrollToPackages={scrollToPackages}
              />

              <ModernElementsDisplay
                bodyElement={bodyUseAnalysis.bodyElement}
                useElement={bodyUseAnalysis.useElement}
                bodyOrganSimple={
                  ELEMENT_TO_ORGAN[bodyUseAnalysis.bodyElement]?.organSimple || bodyUseAnalysis.bodyElement
                }
                useOrganSimple={ELEMENT_TO_ORGAN[bodyUseAnalysis.useElement]?.organSimple || bodyUseAnalysis.useElement}
                relation={bodyUseAnalysis.relationship}
                relationExplanation={displayInterpretation.summary}
              />

              <ModernAdviceCard interpretation={displayInterpretation} />

              <SeasonalAnalysis
                seasonElement={seasonalAnalysis.seasonElement}
                bodyStrength={seasonalAnalysis.bodyStrength}
                useStrength={seasonalAnalysis.useStrength}
                dangerousMonths={seasonalAnalysis.dangerousMonths}
                safeMonths={seasonalAnalysis.safeMonths}
                recoveryMonths={seasonalAnalysis.recoveryMonths}
                currentMonthRisk={seasonalAnalysis.currentMonthRisk}
                currentMonth={currentMonth}
              />
            </>
          )}

          <Card className="border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Quẻ Hình và Biến Hóa</CardTitle>
              <p className="text-sm text-muted-foreground">Quẻ chính và quẻ biến sau khi hào động thay đổi</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="main" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="main" className="text-base">
                    Quẻ Chính (本卦)
                  </TabsTrigger>
                  <TabsTrigger value="transformed" className="text-base">
                    Quẻ Biến (变卦)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="space-y-4 mt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <HexagramSVG
                      upperLines={upperTrigram?.lines || [true, true, true]}
                      lowerLines={lowerTrigram?.lines || [true, true, true]}
                      movingLine={moving}
                      className="w-32 h-32"
                    />

                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-bold text-foreground">{hexagramData?.chinese || "—"}</h3>
                      <p className="text-xl text-primary font-medium">{hexagramData?.vietnamese || "—"}</p>
                      <p className="text-sm text-muted-foreground">Quẻ thứ {hexagramData?.number}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-center">
                      <Badge variant="secondary" className="text-sm">
                        Thượng: {upperTrigram?.vietnamese} ({upperTrigram?.element})
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        Hạ: {lowerTrigram?.vietnamese} ({lowerTrigram?.element})
                      </Badge>
                      <Badge variant="outline" className="text-sm bg-accent/10">
                        Động: Hào {moving}
                      </Badge>
                    </div>

                    {hexagramData && (
                      <div className="w-full p-4 bg-secondary/50 border border-border/50 rounded-lg space-y-3 mt-4">
                        <div>
                          <h4 className="font-semibold text-base text-foreground mb-1">Quẻ tượng:</h4>
                          <p className="text-base text-muted-foreground leading-relaxed">{hexagramData.image}</p>
                          <p className="text-sm text-muted-foreground/70 italic mt-1">{hexagramData.imageVietnamese}</p>
                        </div>
                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-base text-foreground mb-1">Ý nghĩa:</h4>
                          <p className="text-base text-muted-foreground">{hexagramData.meaning}</p>
                          <p className="text-sm text-muted-foreground/70 italic mt-1">
                            {hexagramData.meaningVietnamese}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="transformed" className="space-y-4 mt-6">
                  {transformedHexagram ? (
                    <div className="flex flex-col items-center space-y-4">
                      <HexagramSVG
                        upperLines={getTrigramByNumber(transformedHexagram.upper)?.lines || [true, true, true]}
                        lowerLines={getTrigramByNumber(transformedHexagram.lower)?.lines || [true, true, true]}
                        movingLine={undefined}
                        className="w-32 h-32"
                      />

                      <div className="text-center space-y-2">
                        <h3 className="text-3xl font-bold text-primary">
                          {transformedHexagram.hexagram?.chinese || "—"}
                        </h3>
                        <p className="text-xl font-medium text-primary">
                          {transformedHexagram.hexagram?.vietnamese || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">Quẻ thứ {transformedHexagram.hexagram?.number}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap justify-center">
                        <Badge variant="secondary" className="text-sm">
                          Thượng: {getTrigramByNumber(transformedHexagram.upper)?.vietnamese}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          Hạ: {getTrigramByNumber(transformedHexagram.lower)?.vietnamese}
                        </Badge>
                      </div>

                      <div className="w-full p-4 bg-primary/10 border border-primary/20 rounded-lg mt-4">
                        <p className="text-base text-muted-foreground text-center">
                          Quẻ này thể hiện xu hướng biến hóa trong tương lai
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base text-muted-foreground">Không có quẻ biến</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div id="treatment-packages" className="scroll-mt-20">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl md:text-3xl">Gói Dịch Vụ Chi Tiết</CardTitle>
                </div>
                <p className="text-base text-muted-foreground">
                  Chọn gói phù hợp để nhận phác đồ chăm sóc sức khỏe cá nhân hóa từ chuyên gia
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "khai-huyet" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">Phù hợp với bạn</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10">
                      <img
                        src="/traditional-herbal-medicine-herbs-natural-remedies.jpg"
                        alt="Gói Nam Dược"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">Gói Nam Dược</h3>
                      <p className="text-3xl font-bold text-primary">199.000đ</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Bài thảo dược thiên nhiên được pha chế riêng theo ngũ hành cá nhân, giúp cân bằng âm dương và
                        tăng cường sức khỏe toàn diện
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "khai-huyet" ? "default" : "outline"}
                        onClick={() => handlePackageClick(1)}
                      >
                        Chọn gói này
                      </Button>
                    </div>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "nam-duoc" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">Phù hợp với bạn</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10">
                      <img
                        src="/acupressure-points-meridian-therapy-wellness.jpg"
                        alt="Gói Khai Huyệt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">Gói Khai Huyệt</h3>
                      <p className="text-3xl font-bold text-primary">299.000đ</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Phương pháp khai thông kinh lạc và huyệt đạo truyền thống, giúp lưu thông khí huyết và phục hồi
                        năng lượng cơ thể
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "nam-duoc" ? "default" : "outline"}
                        onClick={() => handlePackageClick(2)}
                      >
                        Chọn gói này
                      </Button>
                    </div>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden">
                    {recommendedPackage.primary === "tuong-so" && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-md">Phù hợp với bạn</Badge>
                      </div>
                    )}
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10">
                      <img
                        src="/i-ching-hexagram-yijing-divination-ancient-wisdom.jpg"
                        alt="Gói Tượng Số"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">Gói Tượng Số</h3>
                      <p className="text-3xl font-bold text-primary">99.000đ</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Phân tích chuyên sâu Mai Hoa Dịch Số với lộ trình dài hạn, giúp bạn hiểu rõ vận mệnh và tối ưu
                        hóa sức khỏe theo quy luật tự nhiên
                      </p>
                      <Button
                        size="lg"
                        className="w-full"
                        variant={recommendedPackage.primary === "tuong-so" ? "default" : "outline"}
                        onClick={() => handlePackageClick(3)}
                      >
                        Chọn gói này
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showPaymentModal && selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPackage(null)
          }}
          packageNumber={selectedPackage}
          upper={upper}
          lower={lower}
          moving={moving}
        />
      )}
    </div>
  )
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  )
}
