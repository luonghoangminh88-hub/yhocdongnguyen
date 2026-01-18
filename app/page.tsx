"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { HexagramSVG } from "@/components/hexagram-svg"
import { UserNav } from "@/components/user-nav"
import { QuickAuthModal } from "@/components/quick-auth-modal"
import { MaiHoaGuardrailModal } from "@/components/mai-hoa-guardrail-modal"
import { AppHeader } from "@/components/app-header"
import { PersonalInfoFields } from "@/components/divination/personal-info-fields"
import { TimeInputFields } from "@/components/divination/time-input-fields"
import { NumberInputFields } from "@/components/divination/number-input-fields"
import { canUserDivine, saveDivinationRecord } from "@/lib/actions/divination-actions"
import { useAuth } from "@/lib/auth/use-auth"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import type { TimeInput } from "@/lib/types"
import {
	Sparkles,
	BookOpen,
	Info,
	ArrowRight,
	HelpCircle,
	CheckCircle2,
	Clock,
	Hash,
	Target,
	Zap,
	User, // Import User icon
} from "lucide-react"

interface DivinationRecord {
  timestamp: number
  concern: string
}

function flipTrigramLine(trigramNumber: number, linePosition: number): number {
  const trigram = getTrigramByNumber(trigramNumber)
  if (!trigram) return trigramNumber

  const lines = [...trigram.lines] as [boolean, boolean, boolean]
  // linePosition: 1, 2, 3 corresponds to lines[0], lines[1], lines[2]
  const index = linePosition - 1
  lines[index] = !lines[index] // Flip the line: Dương ↔ Âm

  // Find the trigram that matches these lines
  const allTrigrams = [
    getTrigramByNumber(1),
    getTrigramByNumber(2),
    getTrigramByNumber(3),
    getTrigramByNumber(4),
    getTrigramByNumber(5),
    getTrigramByNumber(6),
    getTrigramByNumber(7),
    getTrigramByNumber(8),
  ]

  const matchingTrigram = allTrigrams.find(
    (t) => t?.lines[0] === lines[0] && t?.lines[1] === lines[1] && t?.lines[2] === lines[2],
  )

  return matchingTrigram?.number || trigramNumber
}

function calculateHexagramWithMinute(input: TimeInput) {
  const { year, month, day, hour, minute } = input

  // Chuyển giờ sang địa chi (1-12)
  const hourBranch = getHourBranch(hour)

  // Quẻ Thượng: (Năm + Tháng + Ngày) % 8, dư 0 lấy 8
  const upperSum = year + month + day
  const upperTrigram = upperSum % 8 === 0 ? 8 : upperSum % 8

  // Quẻ Hạ: (Năm + Tháng + Ngày + Giờ địa chi) % 8, dư 0 lấy 8
  const lowerSum = year + month + day + hourBranch
  const lowerTrigram = lowerSum % 8 === 0 ? 8 : lowerSum % 8

  // Hào Động: (Năm + Tháng + Ngày + Giờ địa chi + Phút) % 6, dư 0 lấy 6
  // Thêm phút để đa dạng hóa kết quả hào động
  const movingSum = year + month + day + hourBranch + minute
  const movingLine = movingSum % 6 === 0 ? 6 : movingSum % 6

  return {
    upperTrigram,
    lowerTrigram,
    movingLine,
    hourBranch,
  }
}

function getHourBranch(hour: number): number {
  // Tý (23:00-00:59) = 1
  // Sửu (01:00-02:59) = 2
  // Dần (03:00-04:59) = 3
  // Mão (05:00-06:59) = 4
  // Thìn (07:00-08:59) = 5
  // Tỵ (09:00-11:00) = 6
  // Ngọ (11:00-13:00) = 7
  // Mùi (13:00-15:00) = 8
  // Thân (15:00-17:00) = 9
  // Dậu (17:00-19:00) = 10
  // Tuất (19:00-21:00) = 11
  // Hợi (21:00-23:00) = 12
  if (hour === 23 || hour === 0) return 1 // Tý
  return Math.floor((hour + 1) / 2) + 1
}

function getHourBranchName(branch: number): string {
  const names = ["", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
  return names[branch] || ""
}

const ZODIAC_HOURS = [
  { label: "Tý (23:00-01:00)", value: 1 },
  { label: "Sửu (01:00-03:00)", value: 2 },
  { label: "Dần (03:00-05:00)", value: 3 },
  { label: "Mão (05:00-07:00)", value: 4 },
  { label: "Thìn (07:00-09:00)", value: 5 },
  { label: "Tỵ (09:00-11:00)", value: 6 },
  { label: "Ngọ (11:00-13:00)", value: 7 },
  { label: "Mùi (13:00-15:00)", value: 8 },
  { label: "Thân (15:00-17:00)", value: 9 },
  { label: "Dậu (17:00-19:00)", value: 10 },
  { label: "Tuất (19:00-21:00)", value: 11 },
  { label: "Hợi (21:00-23:00)", value: 12 },
]

function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
  const s1 = normalize(text1)
  const s2 = normalize(text2)

  if (s1 === s2) return 1.0

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const commonWords = words1.filter((w) => words2.includes(w)).length
  const similarity = (2 * commonWords) / (words1.length + words2.length)

  return similarity
}

function findSimilarPreviousQuestion(
  currentQuestion: string,
  history: DivinationRecord[],
): { found: boolean; record?: DivinationRecord; similarity?: number } {
  if (!currentQuestion || history.length === 0) {
    return { found: false }
  }

  for (const record of history.slice().reverse()) {
    const similarity = calculateSimilarity(currentQuestion, record.concern)
    if (similarity >= 0.8) {
      // 80% giống nhau
      return { found: true, record, similarity }
    }
  }

  return { found: false }
}

export default function MainPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const [guardrailModal, setGuardrailModal] = useState<{
    isOpen: boolean
    reason: string
    details?: any
  }>({
    isOpen: false,
    reason: "",
    details: null,
  })

  const [result, setResult] = useState<{
    upperTrigram: number
    lowerTrigram: number
    movingLine: number
    hexagramName: string
    transformedUpperTrigram?: number
    transformedLowerTrigram?: number
    transformedHexagramName?: string
  } | null>(null)
  const [divinationMethod, setDivinationMethod] = useState<"time" | "number">("time")
  const [numberInput, setNumberInput] = useState({ upper: "", lower: "", moving: "" })
  const [healthConcern, setHealthConcern] = useState("")

  // Anthropometric data states
  const [gender, setGender] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [birthYear, setBirthYear] = useState<string>("") // Năm sinh (dương lịch)
  const [birthMonth, setBirthMonth] = useState<string>("") // Tháng sinh (dương lịch)
  const [birthDay, setBirthDay] = useState<string>("") // Ngày sinh (dương lịch)
  const [painLocation, setPainLocation] = useState<string>("")
  const [userLocation, setUserLocation] = useState<string>("")

  const [input, setInput] = useState<TimeInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  })

  const currentHourBranch = getHourBranch(input.hour)
  const currentHourBranchName = getHourBranchName(currentHourBranch)

  async function handleCalculateResult() {
    if (!healthConcern.trim()) {
      alert("Vui lòng nhập lý do hỏi quẻ (Chủ tố)")
      return
    }

    if (divinationMethod === "time") {
      const timeInput: TimeInput = {
        year: input.year,
        month: input.month,
        day: input.day,
        hour: input.hour,
        minute: input.minute,
      }

      const calculatedResult = calculateHexagramWithMinute(timeInput)
      const upperTrigramData = getTrigramByNumber(calculatedResult.upperTrigram)
      const lowerTrigramData = getTrigramByNumber(calculatedResult.lowerTrigram)
      const hexagram = getHexagramByTrigrams(calculatedResult.upperTrigram, calculatedResult.lowerTrigram)

      let transformedUpper = calculatedResult.upperTrigram
      let transformedLower = calculatedResult.lowerTrigram

      if (calculatedResult.movingLine <= 3) {
        // Moving line is in lower trigram (lines 1, 2, 3)
        transformedLower = flipTrigramLine(calculatedResult.lowerTrigram, calculatedResult.movingLine)
      } else {
        // Moving line is in upper trigram (lines 4, 5, 6 → positions 1, 2, 3)
        const upperLinePosition = calculatedResult.movingLine - 3
        transformedUpper = flipTrigramLine(calculatedResult.upperTrigram, upperLinePosition)
      }

      const transformedHexagram = getHexagramByTrigrams(transformedUpper, transformedLower)

      setResult({
        upperTrigram: calculatedResult.upperTrigram,
        lowerTrigram: calculatedResult.lowerTrigram,
        movingLine: calculatedResult.movingLine,
        hexagramName: hexagram?.vietnamese || `${upperTrigramData?.vietnamese} ${lowerTrigramData?.vietnamese}`,
        transformedUpperTrigram: transformedUpper,
        transformedLowerTrigram: transformedLower,
        transformedHexagramName: transformedHexagram?.vietnamese || "",
      })
    } else {
      // Number method
      const upper = Number.parseInt(numberInput.upper) || 1
      const lower = Number.parseInt(numberInput.lower) || 1
      const moving = Number.parseInt(numberInput.moving) || 1

      const upperMod = ((upper - 1) % 8) + 1
      const lowerMod = ((lower - 1) % 8) + 1
      const movingMod = ((moving - 1) % 6) + 1

      const upperTrigramData = getTrigramByNumber(upperMod)
      const lowerTrigramData = getTrigramByNumber(lowerMod)
      const hexagram = getHexagramByTrigrams(upperMod, lowerMod)

      let transformedUpper = upperMod
      let transformedLower = lowerMod

      if (movingMod <= 3) {
        // Moving line is in lower trigram
        transformedLower = flipTrigramLine(lowerMod, movingMod)
      } else {
        // Moving line is in upper trigram
        const upperLinePosition = movingMod - 3
        transformedUpper = flipTrigramLine(upperMod, upperLinePosition)
      }

      const transformedHexagram = getHexagramByTrigrams(transformedUpper, transformedLower)

      setResult({
        upperTrigram: upperMod,
        lowerTrigram: lowerMod,
        movingLine: movingMod,
        hexagramName: hexagram?.vietnamese || `${upperTrigramData?.vietnamese} ${lowerTrigramData?.vietnamese}`,
        transformedUpperTrigram: transformedUpper,
        transformedLowerTrigram: transformedLower,
        transformedHexagramName: transformedHexagram?.vietnamese || "",
      })
    }

    // Smooth scroll to result
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  async function handleNavigateToDiagnosis() {
    setIsNavigating(true)
    console.log("[v0] Navigation button clicked")
    console.log("[v0] User:", user ? "logged in" : "not logged in")
    console.log("[v0] Result:", result)

    try {
      // Auto convert birthdate to Can Chi if provided
      let canChiParams = ""
      if (birthYear && Number.parseInt(birthYear) >= 1900) {
        const { convertBirthYear } = await import("@/lib/birth-year-converter")
        const canChiInfo = convertBirthYear(
          Number.parseInt(birthYear),
          Number.parseInt(birthMonth) || 6,
          Number.parseInt(birthDay) || 15,
        )
        canChiParams = `&canNam=${encodeURIComponent(canChiInfo.canNam)}&chiNam=${encodeURIComponent(canChiInfo.chiNam)}&canNgay=${encodeURIComponent(canChiInfo.canNgay)}&chiNgay=${encodeURIComponent(canChiInfo.chiNgay)}&element=${encodeURIComponent(canChiInfo.element)}&lunarYear=${canChiInfo.lunarYear}&age=${canChiInfo.age}`
        console.log("[v0] Auto-converted Can Chi:", canChiInfo)
      }

      if (!user) {
        console.log("[v0] Opening auth modal")
        if (result) {
          const navigationData = {
            url:
              divinationMethod === "time"
                ? `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&year=${input.year}&month=${input.month}&day=${input.day}&hour=${input.hour}&minute=${input.minute}&method=time&gender=${gender}&birthYear=${birthYear}&birthMonth=${birthMonth}&birthDay=${birthDay}&painLocation=${painLocation}&location=${userLocation}${canChiParams}`
                : `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&method=manual&gender=${gender}&birthYear=${birthYear}&birthMonth=${birthMonth}&birthDay=${birthDay}&painLocation=${painLocation}&location=${userLocation}${canChiParams}`,
            formData: {
              healthConcern,
              gender,
              age,
              painLocation,
              userLocation,
              result,
              divinationMethod,
              input,
            },
          }
          sessionStorage.setItem("pendingNavigation", JSON.stringify(navigationData))
        }
        setAuthModalOpen(true)
        setIsNavigating(false)
        return
      }

      console.log("[v0] User authenticated - proceeding with navigation")
      // User is logged in, proceed with navigation directly
      if (divinationMethod === "time") {
        const timeInput: TimeInput = {
          year: input.year,
          month: input.month,
          day: input.day,
          hour: input.hour,
          minute: input.minute,
        }

        // Save to database
        await saveDivinationRecord({
          year: timeInput.year,
          month: timeInput.month,
          day: timeInput.day,
          hour: timeInput.hour,
          upperTrigram: result.upperTrigram,
          lowerTrigram: result.lowerTrigram,
          movingLine: result.movingLine,
          hexagramName: result.hexagramName,
          healthConcern: healthConcern,
          gender: gender,
          age: birthYear ? new Date().getFullYear() - Number.parseInt(birthYear) : 0,
          painLocation: painLocation,
          location: userLocation,
        })

        router.push(
          `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&year=${timeInput.year}&month=${timeInput.month}&day=${timeInput.day}&hour=${timeInput.hour}&minute=${timeInput.minute}&method=time&gender=${gender}&birthYear=${birthYear}&birthMonth=${birthMonth}&birthDay=${birthDay}&painLocation=${painLocation}&location=${userLocation}${canChiParams}`,
        )
      } else {
        // Manual method
        await saveDivinationRecord({
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
          hour: new Date().getHours(),
          upperTrigram: result.upperTrigram,
          lowerTrigram: result.lowerTrigram,
          movingLine: result.movingLine,
          hexagramName: result.hexagramName,
          healthConcern: healthConcern,
          gender: gender,
          age: birthYear ? new Date().getFullYear() - Number.parseInt(birthYear) : 0,
          painLocation: painLocation,
          location: userLocation,
        })

        router.push(
          `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&method=number&gender=${gender}&birthYear=${birthYear}&birthMonth=${birthMonth}&birthDay=${birthDay}&painLocation=${painLocation}&location=${userLocation}${canChiParams}`,
        )
      }
    } catch (error) {
      console.error("[v0] Navigation error:", error)
      setIsNavigating(false)
    }
  }

  const upperTrigram = result ? getTrigramByNumber(result.upperTrigram) : null
  const lowerTrigram = result ? getTrigramByNumber(result.lowerTrigram) : null
  const hexagramData = result ? getHexagramByTrigrams(result.upperTrigram, result.lowerTrigram) : null

  const handleAuthModalClose = () => {
    setAuthModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      <AppHeader />

      <section className="relative py-12 md:py-16 lg:py-24 px-4 overflow-hidden">
        <div className="hero-pattern" />
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <Badge variant="outline" className="text-xs md:text-sm px-2 md:px-3 py-1">
                Y học cổ truyền Trung Quốc
              </Badge>
              <h1 className="text-foreground text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Khám phá sức khỏe qua
                <span className="block text-primary mt-2">Mai Hoa Dịch Số</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Mỗi cơn đau, mỗi triệu chứng đều là lời cơ thể nhắc nhở. Bằng Mai Hoa Dịch Số - môn học mà ông tổ Thiệu
                Khang Tiết truyền lại cách đây gần nghìn năm - chúng ta có thể "đọc" được những thông điệp ấy. Giờ đây,
                trí tuệ nhân tạo giúp chúng ta giải mã những ẩn ý sâu xa từ quẻ, mang đến cho bạn cái nhìn rõ ràng về
                tình trạng sức khỏe hiện tại.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("divination-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="gap-2"
                >
                  Bắt đầu khởi quẻ
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/learn")}>
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/10">
                <img
                  src="/traditional-chinese-medicine-herbs-acupuncture-nee.jpg"
                  alt="Y học cổ truyền"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-4">
              Công nghệ AI
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Tích Hợp Công Nghệ Vào Phân Tích, Diễn Giải
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi không đơn thuần "số hóa" kiến thức. Chúng tôi kết nối tinh hoa từ kho tàng kiến thức Mai Hoa
              Dịch Số của Thiệu Khang Tiết và Hoàng Đế Nội Kinh tích hợp với công nghệ tiên tiến từ AI cập nhật, phân
              tích liên tục. Giúp bạn nhận được lời khuyên như đang trò chuyện cùng một vị thầy thuốc kỳ lão.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg md:text-xl">Tính Toán Quẻ Chuẩn Xác</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Thuật toán được xây dựng dựa trên nguyên lý Thể - Dụng và quan hệ Ngũ Hành chuẩn mực
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Phân định Thể - Dụng theo đúng pháp môn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Xét quan hệ sinh khắc Ngũ Hành tỉ mỉ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Tính toán ảnh hưởng mùa và thời điểm</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg md:text-xl">Kho Tàng Kiến Thức Kinh Điển</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Mọi lời giải đều bắt nguồn từ các tác phẩm gốc, không hư cấu, không bịa đặt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Tám quẻ thuần và các bộ phận cơ thể</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Phân tích triệu chứng theo quy luật Ngũ hành</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Phương pháp chăm sóc bằng thảo dược thiên nhiên</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg md:text-xl">Tích Hợp Công Nghê AI</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Phân tích hàng ngàn tài liệu để đưa ra kết quả chính xác nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Giải thích cơ chế theo Y học cổ truyền</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Lời khuyên thực tế, chi tiết từng bước</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                    <span>Luôn có kết quả dựa trên logic chuẩn</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Chọn cách khởi quẻ phù hợp với bạn</h2>

            <Alert className="max-w-2xl mx-auto mt-4 border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Lời dặn từ xưa:</strong> Một lần hỏi cho một việc, một ngày nên hỏi một quẻ. Tâm tĩnh thì linh,
                tâm loạn thì quẻ không ứng. Đây là điều các bậc tiền nhân luôn nhắc nhở.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input form */}
            <Card id="divination-form" className="border-2">
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Nhập Thông Tin Khởi Quẻ
                </CardTitle>
                <CardDescription>Chọn phương pháp khởi quẻ phù hợp với tình huống của bạn</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Trust indicators */}
                <div className="mb-6 p-4 bg-jade/5 border border-jade/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-jade mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Cam kết bảo mật thông tin</p>
                      <p className="text-xs text-muted-foreground">
                        Thông tin của bạn được mã hóa và chỉ sử dụng cho mục đích chẩn đoán. Chúng tôi tuân thủ nghiêm
                        ngặt quy định về bảo mật dữ liệu y tế.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health concern field */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      Chủ tố (Lý do hỏi quẻ)
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      Quan trọng
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Mô tả tình trạng sức khỏe hoặc vấn đề bạn muốn hỏi. Ví dụ: Đau đầu thường xuyên, mất ngủ, đau dạ dày..."
                    value={healthConcern}
                    onChange={(e) => setHealthConcern(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Gợi ý:</strong> Mô tả cụ thể triệu chứng, thời gian xuất hiện, và mức độ ảnh hưởng để nhận
                      được chẩn đoán chính xác hơn.
                    </span>
                  </p>
                </div>

                <Tabs value={divinationMethod} onValueChange={(v) => setDivinationMethod(v as "time" | "number")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="time" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Theo Thời Gian
                    </TabsTrigger>
                    <TabsTrigger value="number" className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Theo Số
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="time" className="space-y-4">
                    <Alert className="bg-primary/5 border-primary/20">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Phương pháp Niên Nguyệt Nhật Thời</strong> (年月日时起卦)
                        <br />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Dựa trên nguyên lý "Thiên Nhân Hợp Nhất" - thời điểm hỏi quẻ phản ánh trạng thái năng lượng của người hỏi.
                        </span>
                      </AlertDescription>
                    </Alert>

                    <PersonalInfoFields
                      gender={gender}
                      setGender={setGender}
                      birthYear={birthYear}
                      setBirthYear={setBirthYear}
                      birthMonth={birthMonth}
                      setBirthMonth={setBirthMonth}
                      birthDay={birthDay}
                      setBirthDay={setBirthDay}
                      painLocation={painLocation}
                      setPainLocation={setPainLocation}
                      userLocation={userLocation}
                      setUserLocation={setUserLocation}
                    />

                    <TimeInputFields input={input} setInput={setInput} currentHourBranchName={currentHourBranchName} />

                    <Button onClick={handleCalculateResult} className="w-full mt-6" size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Khởi Quẻ Theo Thời Gian
                    </Button>
                  </TabsContent>

                  <TabsContent value="number" className="space-y-4">
                    <Alert className="bg-accent/5 border-accent/20">
                      <Info className="h-4 w-4 text-accent" />
                      <AlertDescription className="text-sm">
                        <strong>Phương pháp Trực Tiếp Số Tự Nhiên</strong> (直接数字起卦)
                        <br />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Sử dụng số ngẫu nhiên hoặc số có ý nghĩa với bạn. Nguyên lý "Vạn vật giai số".
                        </span>
                      </AlertDescription>
                    </Alert>

                    <PersonalInfoFields
                      gender={gender}
                      setGender={setGender}
                      birthYear={birthYear}
                      setBirthYear={setBirthYear}
                      birthMonth={birthMonth}
                      setBirthMonth={setBirthMonth}
                      birthDay={birthDay}
                      setBirthDay={setBirthDay}
                      painLocation={painLocation}
                      setPainLocation={setPainLocation}
                      userLocation={userLocation}
                      setUserLocation={setUserLocation}
                    />

                    <NumberInputFields numberInput={numberInput} setNumberInput={setNumberInput} />

                    <Button onClick={handleCalculateResult} className="w-full mt-6" size="lg">
                      <Hash className="w-4 h-4 mr-2" />
                      Khởi Quẻ Theo Số
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Result display */}
            <Card id="result-section" className={`border-2 ${result ? "result-card" : "border-border"}`}>
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle>Kết Quả Gieo Quẻ</CardTitle>
                <CardDescription>{result ? "Quẻ đã được khởi thành công" : "Chờ khởi quẻ"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {result ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Quẻ Chủ (Main Hexagram) */}
                      <div className="p-6 rounded-lg border bg-card space-y-4">
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">1. QUẺ CHỦ (GỐC)</p>
                        </div>

                        <div className="flex justify-center">
                          <HexagramSVG
                            upperLines={upperTrigram?.lines || [true, true, true]}
                            lowerLines={lowerTrigram?.lines || [true, true, true]}
                            movingLine={result.movingLine}
                            className="w-32 h-auto"
                          />
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-foreground">{hexagramData?.chinese}</h3>
                          <p className="text-lg text-primary font-medium">{hexagramData?.vietnamese}</p>
                        </div>

                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-sm">
                            {hexagramData?.category || "THẾ DỤNG"}
                          </Badge>
                        </div>
                      </div>

                      {/* Quẻ Động (Moving Line Info) */}
                      <div className="p-6 rounded-lg border bg-card space-y-4">
                        <div className="text-center space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">2. QUẺ BIẾN (变卦)</p>
                        </div>

                        <div className="flex justify-center">
                          <HexagramSVG
                            upperLines={
                              result.transformedUpperTrigram
                                ? getTrigramByNumber(result.transformedUpperTrigram)?.lines || [true, true, true]
                                : upperTrigram?.lines || [true, true, true]
                            }
                            lowerLines={
                              result.transformedLowerTrigram
                                ? getTrigramByNumber(result.transformedLowerTrigram)?.lines || [true, true, true]
                                : lowerTrigram?.lines || [true, true, true]
                            }
                            movingLine={undefined}
                            className="w-32 h-auto"
                          />
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-2xl font-bold text-primary">
                            {result.transformedHexagramName
                              ? getHexagramByTrigrams(result.transformedUpperTrigram!, result.transformedLowerTrigram!)
                                  ?.chinese || ""
                              : hexagramData?.chinese || ""}
                          </p>
                          <p className="text-lg font-medium text-accent">
                            {result.transformedHexagramName || hexagramData?.vietnamese || ""}
                          </p>
                          <p className="text-sm text-muted-foreground mt-3">
                            Quẻ sau khi <strong>Hào {result.movingLine}</strong> biến đổi
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-sm">
                            Xu Hướng Biến Hóa
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Phân tích sơ bộ tình trạng sức khỏe
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Dựa trên quẻ <strong>{hexagramData?.vietnamese}</strong> với động hào thứ {result.movingLine},
                        hệ thống đã xác định được xu hướng năng lượng và mối liên hệ với tình trạng sức khỏe của bạn.
                        Quẻ tượng phản ánh sự tương tác giữa các yếu tố âm dương và ngũ hành trong cơ thể.
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Để xem phân tích chi tiết về tình trạng bệnh lý, phương pháp điều trị và các khuyến nghị cụ thể,
                        vui lòng nhấn nút bên dưới để chuyển sang trang chẩn đoán chuyên sâu.
                      </p>
                    </div>

                  <Button onClick={handleNavigateToDiagnosis} className="w-full" size="lg" disabled={isNavigating}>
                    {isNavigating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        Xem Kết Quả Chẩn Đoán Chi Tiết
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Chưa có kết quả</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Chọn phương pháp khởi quẻ và nhập thông tin để bắt đầu
                    </p>

                    <div className="mt-8 text-left w-full max-w-sm space-y-3">
                      <p className="text-sm font-medium text-foreground">Hướng dẫn nhanh:</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            1
                          </span>
                          <span>Mô tả tình trạng sức khỏe trong phần "Chủ tố"</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            2
                          </span>
                          <span>Chọn phương pháp khởi quẻ phù hợp</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            3
                          </span>
                          <span>Nhấn "Khởi Quẻ" để xem kết quả</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-4">
              Nguyên tắc cốt lõi
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">5 Nguyên Tắc Mai Hoa Dịch Số</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Hệ thống tuân thủ đầy đủ nguyên tắc cổ truyền của Thiệu Khang Tiết để đảm bảo độ ứng nghiệm cao
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                title: "Bất Động Bất Chiêm",
                subtitle: "不動不占",
                description: "Chỉ gieo quẻ khi thực sự có sự việc xảy ra, có cảm xúc lo lắng",
                icon: <Target className="w-5 h-5" />,
              },
              {
                title: "Nhất Sự Nhất Chiêm",
                subtitle: "一事一占",
                description: "Một vấn đề chỉ nên gieo một quẻ trong ngày. Hỏi lại nhiều thì không linh",
                icon: <Info className="w-5 h-5" />,
              },
              {
                title: "Giới Hạn Tần Suất",
                subtitle: "节制频率",
                description: "3 lần/ngày tối đa, cách nhau 15 phút để khí bình ổn",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                title: "Xác Thực Người Dùng",
                subtitle: "用户认证",
                description: "Tracking cross-device to đảm bảo nguyên tắc được tuân thủ",
                icon: <User className="w-5 h-5" />,
              },
              {
                title: "Kiểm Tra Toàn Diện",
                subtitle: "全面验证",
                description: "5 layers validation trước khi cho phép gieo quẻ",
                icon: <CheckCircle2 className="w-5 h-5" />,
              },
            ].map((principle, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                    {principle.icon}
                  </div>
                  <CardTitle className="text-base md:text-lg">{principle.title}</CardTitle>
                  <CardDescription className="text-xs">{principle.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/ancient-chinese-medical-text-book-i-ching-hexagram.jpg"
                  alt="Sách y học cổ"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
              <Badge variant="outline">Tài liệu tham khảo</Badge>
              <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl font-bold">Nền tảng lý luận vững chắc</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Hệ thống được xây dựng dựa trên các tài liệu kinh điển: Mai Hoa Dịch Số của Thiệu Ung (邵雍), Hoàng Đế
                Nội Kinh (黄帝内经), Châm Cứu Đại Thành, và phương pháp chăm sóc sức khỏe phát triển từ thực hành lâm
                sàng.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Khởi quẻ chính xác",
                    description: "Phương pháp khởi quẻ chuẩn xác theo Mai Hoa Dịch Số",
                  },
                  {
                    title: "Thể Dụng phân tích",
                    description: "Xác định quan hệ Thể-Dụng và Ngũ Hành sinh khắc",
                  },
                  {
                    title: "Kết hợp Y học",
                    description: "Áp dụng 8 quẻ thuần vào chẩn đoán tạng phủ",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-jade flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm md:text-base">{item.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => router.push("/learn")} className="mt-4">
                Tìm hiểu thêm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <QuickAuthModal open={authModalOpen} onOpenChange={handleAuthModalClose} />
      <MaiHoaGuardrailModal
        open={guardrailModal.isOpen}
        onOpenChange={(open) => setGuardrailModal({ ...guardrailModal, isOpen: open })}
        reason={guardrailModal.reason}
        details={guardrailModal.details}
      />
    </div>
  )
}
