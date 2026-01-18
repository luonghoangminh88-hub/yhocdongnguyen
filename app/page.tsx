"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { getHexagramByTrigrams } from "@/lib/data/hexagram-data"
import { HexagramSVG } from "@/components/hexagram-svg"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/user-nav"
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
  User,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QuickAuthModal } from "@/components/quick-auth-modal"
import { canUserDivine, saveDivinationRecord } from "@/lib/actions/divination-actions"
import { useAuth } from "@/lib/auth/use-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/actions/auth-actions"

interface TimeInput {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

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

  const handleAuthModalClose = async (open: boolean) => {
    setAuthModalOpen(open)

    if (!open) {
      // Check if there's pending navigation data in sessionStorage
      const pendingNav = sessionStorage.getItem("pendingNavigation")

      if (pendingNav) {
        const navData = JSON.parse(pendingNav)
        sessionStorage.removeItem("pendingNavigation")

        // Wait a bit for auth state to update
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user is now logged in (reload auth)
        const currentUser = await getCurrentUser()

        if (currentUser) {
          // User is logged in, navigate with saved data
          router.push(navData.url)
        } else {
          // User cancelled login, just reload to refresh state
          window.location.reload()
        }
      } else {
        // No pending navigation, just reload
        window.location.reload()
      }
    }
  }

  const [input, setInput] = useState<TimeInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
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
  const [age, setAge] = useState<string>("") // Changed age state from number to string to allow empty input
  const [painLocation, setPainLocation] = useState<string>("")
  const [userLocation, setUserLocation] = useState<string>("")

  const [guardrailModal, setGuardrailModal] = useState<{
    isOpen: boolean
    reason: string
    details?: any
  }>({
    isOpen: false,
    reason: "",
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
    console.log("[v0] Navigation button clicked")
    console.log("[v0] User:", user ? "logged in" : "not logged in")
    console.log("[v0] Result:", result)

    if (!user) {
      console.log("[v0] Opening auth modal")
      if (result) {
        const navigationData = {
          url:
            divinationMethod === "time"
              ? `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&year=${input.year}&month=${input.month}&day=${input.day}&hour=${input.hour}&minute=${input.minute}&method=time&gender=${gender}&age=${age}&painLocation=${painLocation}&location=${userLocation}`
              : `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&method=manual&gender=${gender}&age=${age}&painLocation=${painLocation}&location=${userLocation}`,
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
      return
    }

    // Comprehensive check theo nguyên tắc Mai Hoa
    const checkResult = await canUserDivine(healthConcern)
    console.log("[v0] Permission check result:", checkResult)

    if (!checkResult.allowed) {
      console.log("[v0] Not allowed - opening guardrail modal")
      setGuardrailModal({
        isOpen: true,
        reason: checkResult.reason || "Không thể gieo quẻ lúc này",
        details: checkResult.details,
      })
      return
    }

    console.log("[v0] Permission granted - proceeding with navigation")
    // Allowed - proceed with navigation
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
        age: Number.parseInt(age) || 0, // Parse age string to number when saving
        painLocation: painLocation,
        location: userLocation,
      })

      router.push(
        `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&year=${timeInput.year}&month=${timeInput.month}&day=${timeInput.day}&hour=${timeInput.hour}&minute=${timeInput.minute}&method=time&gender=${gender}&age=${age}&painLocation=${painLocation}&location=${userLocation}`,
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
        age: Number.parseInt(age) || 0, // Parse age string to number when saving
        painLocation: painLocation,
        location: userLocation,
      })

      router.push(
        `/diagnosis?upper=${result.upperTrigram}&lower=${result.lowerTrigram}&moving=${result.movingLine}&healthConcern=${encodeURIComponent(healthConcern)}&method=number&gender=${gender}&age=${age}&painLocation=${painLocation}&location=${userLocation}`,
      )
    }
  }

  const upperTrigram = result ? getTrigramByNumber(result.upperTrigram) : null
  const lowerTrigram = result ? getTrigramByNumber(result.lowerTrigram) : null
  const hexagramData = result ? getHexagramByTrigrams(result.upperTrigram, result.lowerTrigram) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="accent-border-left">
              <h1 className="text-base md:text-xl font-bold">Y Dịch Đồng Nguyên</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">梅花易数 • Mai Hoa Dịch Số</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/services")} className="hidden md:flex">
              <Sparkles className="w-4 h-4 mr-2" />
              Gói dịch vụ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/learn")} className="hidden md:flex">
              <BookOpen className="w-4 h-4 mr-2" />
              Tìm hiểu
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

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

                  <div className="mb-6 p-4 bg-secondary/30 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-semibold">Thông tin bổ sung (Giúp chẩn đoán chính xác hơn)</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Giới tính</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Tuổi</Label>
                        <Input
                          type="number"
                          min="1"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)} // Allow empty string, no longer forces 0
                          placeholder="Nhập tuổi"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Vị trí đau/khó chịu</Label>
                      <Select value={painLocation} onValueChange={setPainLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Bên trái cơ thể</SelectItem>
                          <SelectItem value="right">Bên phải cơ thể</SelectItem>
                          <SelectItem value="center">Bên trong/Nội tâm</SelectItem>
                          <SelectItem value="whole">Toàn thân</SelectItem>
                          <SelectItem value="unknown">Không rõ ràng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Tỉnh/Thành phố bạn đang sinh sống</Label>
                      <Select value={userLocation} onValueChange={setUserLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="hanoi">Hà Nội</SelectItem>
                          <SelectItem value="hochiminh">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="danang">Đà Nẵng</SelectItem>
                          <SelectItem value="haiphong">Hải Phòng</SelectItem>
                          <SelectItem value="cantho">Cần Thơ</SelectItem>
                          <SelectItem value="halong">Hạ Long (Quảng Ninh)</SelectItem>
                          <SelectItem value="vungtau">Vũng Tàu</SelectItem>
                          <SelectItem value="nhatrang">Nha Trang</SelectItem>
                          <SelectItem value="dalat">Đà Lạt</SelectItem>
                          <SelectItem value="hue">Huế</SelectItem>
                          <SelectItem value="angiang">An Giang</SelectItem>
                          <SelectItem value="baria">Bà Rịa - Vũng Tàu</SelectItem>
                          <SelectItem value="baclieu">Bạc Liêu</SelectItem>
                          <SelectItem value="backan">Bắc Kạn</SelectItem>
                          <SelectItem value="bacgiang">Bắc Giang</SelectItem>
                          <SelectItem value="bacninh">Bắc Ninh</SelectItem>
                          <SelectItem value="bentre">Bến Tre</SelectItem>
                          <SelectItem value="binhdinh">Bình Định</SelectItem>
                          <SelectItem value="binhduong">Bình Dương</SelectItem>
                          <SelectItem value="binhphuoc">Bình Phước</SelectItem>
                          <SelectItem value="binhthuan">Bình Thuận</SelectItem>
                          <SelectItem value="camau">Cà Mau</SelectItem>
                          <SelectItem value="caobang">Cao Bằng</SelectItem>
                          <SelectItem value="daklak">Đắk Lắk</SelectItem>
                          <SelectItem value="daknong">Đắk Nông</SelectItem>
                          <SelectItem value="dienbien">Điện Biên</SelectItem>
                          <SelectItem value="dongnai">Đồng Nai</SelectItem>
                          <SelectItem value="dongthap">Đồng Tháp</SelectItem>
                          <SelectItem value="gialai">Gia Lai</SelectItem>
                          <SelectItem value="hagiang">Hà Giang</SelectItem>
                          <SelectItem value="hanam">Hà Nam</SelectItem>
                          <SelectItem value="hatinh">Hà Tĩnh</SelectItem>
                          <SelectItem value="haugiang">Hậu Giang</SelectItem>
                          <SelectItem value="hoabinh">Hòa Bình</SelectItem>
                          <SelectItem value="hungyen">Hưng Yên</SelectItem>
                          <SelectItem value="khanhhoa">Khánh Hòa</SelectItem>
                          <SelectItem value="kiengiang">Kiên Giang</SelectItem>
                          <SelectItem value="kontum">Kon Tum</SelectItem>
                          <SelectItem value="laichau">Lai Châu</SelectItem>
                          <SelectItem value="lamdong">Lâm Đồng</SelectItem>
                          <SelectItem value="langson">Lạng Sơn</SelectItem>
                          <SelectItem value="laocai">Lào Cai</SelectItem>
                          <SelectItem value="longan">Long An</SelectItem>
                          <SelectItem value="namdinh">Nam Định</SelectItem>
                          <SelectItem value="nghean">Nghệ An</SelectItem>
                          <SelectItem value="ninhbinh">Ninh Bình</SelectItem>
                          <SelectItem value="ninhthuan">Ninh Thuận</SelectItem>
                          <SelectItem value="phutho">Phú Thọ</SelectItem>
                          <SelectItem value="phuyen">Phú Yên</SelectItem>
                          <SelectItem value="quangbinh">Quảng Bình</SelectItem>
                          <SelectItem value="quangnam">Quảng Nam</SelectItem>
                          <SelectItem value="quangngai">Quảng Ngãi</SelectItem>
                          <SelectItem value="quangninh">Quảng Ninh</SelectItem>
                          <SelectItem value="quangtri">Quảng Trị</SelectItem>
                          <SelectItem value="soctrang">Sóc Trăng</SelectItem>
                          <SelectItem value="sonla">Sơn La</SelectItem>
                          <SelectItem value="tayninh">Tây Ninh</SelectItem>
                          <SelectItem value="thaibinh">Thái Bình</SelectItem>
                          <SelectItem value="thainguyen">Thái Nguyên</SelectItem>
                          <SelectItem value="thanhhoa">Thanh Hóa</SelectItem>
                          <SelectItem value="tiengiang">Tiền Giang</SelectItem>
                          <SelectItem value="travinh">Trà Vinh</SelectItem>
                          <SelectItem value="tuyenquang">Tuyên Quang</SelectItem>
                          <SelectItem value="vinhlong">Vĩnh Long</SelectItem>
                          <SelectItem value="vinhphuc">Vĩnh Phúc</SelectItem>
                          <SelectItem value="yenbai">Yên Bái</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Alert className="bg-blue-50/50 border-blue-200/50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-xs text-blue-900/70">
                        Thông tin này giúp phân tích theo nguyên lý <strong>Âm-Dương, Tả-Hữu</strong> và{" "}
                        <strong>ảnh hưởng địa lý</strong> trong Mai Hoa Dịch Số, từ đó đưa ra lời khuyên phù hợp hơn với
                        thể trạng của bạn.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <TabsContent value="time" className="space-y-4">
                    <Alert className="bg-primary/5 border-primary/20">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        <strong>Phương pháp Niên Nguyệt Nhật Thời</strong> (年月日时起卦)
                        <br />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Dựa trên nguyên lý "Thiên Nhân Hợp Nhất" - thời điểm hỏi quẻ phản ánh trạng thái năng lượng
                          của người hỏi. Phương pháp này được Thiệu Ung (邵雍) phát triển và ghi chép trong Mai Hoa Dịch
                          Số.
                        </span>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Năm
                          <span className="text-xs text-muted-foreground">(Dương lịch)</span>
                        </Label>
                        <Input
                          type="number"
                          value={input.year}
                          onChange={(e) => setInput({ ...input, year: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Tháng
                          <span className="text-xs text-muted-foreground">(Âm lịch)</span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={input.month}
                          onChange={(e) => setInput({ ...input, month: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        Ngày
                        <span className="text-xs text-muted-foreground">(Âm lịch)</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={input.day}
                        onChange={(e) => setInput({ ...input, day: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Giờ
                          <span className="text-xs text-muted-foreground">(0-23)</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={input.hour}
                          onChange={(e) => setInput({ ...input, hour: Number.parseInt(e.target.value) || 0 })}
                          placeholder="VD: 14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Phút
                          <span className="text-xs text-muted-foreground">(0-59)</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={input.minute}
                          onChange={(e) => setInput({ ...input, minute: Number.parseInt(e.target.value) || 0 })}
                          placeholder="VD: 30"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Địa Chi tương ứng:</span>
                        <Badge variant="outline" className="font-semibold">
                          Giờ {currentHourBranchName} ({currentHourBranch}/12)
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Giờ và phút được tự động cập nhật theo thời gian thực (múi giờ Việt Nam +7). Bạn có thể tự nhập
                        nếu muốn xem quẻ cho thời điểm khác.
                      </p>
                    </div>

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
                          Sử dụng số ngẫu nhiên hoặc số có ý nghĩa với bạn (số điện thoại, ngày sinh, số nhà...). Nguyên
                          lý "Vạn vật giai số" - mọi sự vật đều có thể biểu thị bằng số.
                        </span>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Thượng Quẻ
                          <span className="text-xs text-muted-foreground">(Quẻ trên)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ (VD: 15, 88, 123...)"
                          value={numberInput.upper}
                          onChange={(e) => setNumberInput({ ...numberInput, upper: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Số ÷ 8 lấy dư → xác định 1 trong 8 quẻ cơ bản (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Hạ Quẻ
                          <span className="text-xs text-muted-foreground">(Quẻ dưới)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ"
                          value={numberInput.lower}
                          onChange={(e) => setNumberInput({ ...numberInput, lower: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          Số Động Hào
                          <span className="text-xs text-muted-foreground">(Hào biến đổi)</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Nhập số bất kỳ"
                          value={numberInput.moving}
                          onChange={(e) => setNumberInput({ ...numberInput, moving: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Số ÷ 6 lấy dư → xác định hào động từ 1-6 (đếm từ dưới lên)
                        </p>
                      </div>

                      <Button onClick={handleCalculateResult} className="w-full mt-6" size="lg">
                        <Hash className="w-4 h-4 mr-2" />
                        Khởi Quẻ Theo Số
                      </Button>
                    </div>
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

                    <Button onClick={handleNavigateToDiagnosis} className="w-full" size="lg">
                      Xem Kết Quả Chẩn Đoán Chi Tiết
                      <ArrowRight className="w-4 h-4 ml-2" />
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
                description: "Tracking cross-device để đảm bảo nguyên tắc được tuân thủ",
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
    </div>
  )
}
