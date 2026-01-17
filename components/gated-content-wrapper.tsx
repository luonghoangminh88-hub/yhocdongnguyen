"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, LogIn } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { checkUserAccess, getSolutionsByHexagram } from "@/lib/actions/solution-actions"

interface GatedContentWrapperProps {
  children: React.ReactNode
  solutionType: "acupoint" | "herbal" | "numerology"
  hexagram: string
  packageNumber: 1 | 2 | 3
  onPaymentRequired?: () => void
}

export function GatedContentWrapper({
  children,
  solutionType,
  hexagram,
  packageNumber,
  onPaymentRequired,
}: GatedContentWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [solutionId, setSolutionId] = useState<string | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true)

      // Step 1: Check if user is authenticated
      const { user } = await getCurrentUser()

      if (!user) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      setIsAuthenticated(true)

      // Step 2: Get solution ID for this hexagram and type
      const { solutions } = await getSolutionsByHexagram(hexagram)

      if (!solutions || solutions.length === 0) {
        console.error("[v0] No solutions found for hexagram:", hexagram)
        setIsLoading(false)
        return
      }

      // Find the solution matching this type
      const solution = solutions.find((s) => s.solution_type === solutionType)

      if (!solution) {
        console.error("[v0] No solution found for type:", solutionType)
        setIsLoading(false)
        return
      }

      setSolutionId(solution.id)

      // Step 3: Check if user has access to this solution
      const { hasAccess: userHasAccess } = await checkUserAccess(solution.id)

      setHasAccess(userHasAccess)
      setIsLoading(false)
    }

    checkAccess()
  }, [hexagram, solutionType])

  const handleLoginClick = () => {
    router.push("/auth/login")
  }

  const handlePaymentClick = () => {
    if (onPaymentRequired) {
      onPaymentRequired()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">Yêu Cầu Đăng Nhập</CardTitle>
            <CardDescription>Bạn cần đăng nhập để xem nội dung điều trị này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLoginClick} className="w-full" size="lg">
              Đăng nhập
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => router.push("/auth/register")}
                className="text-primary hover:underline font-medium"
              >
                Đăng ký ngay
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authenticated but no access - show payment required
  if (!hasAccess) {
    const PACKAGE_INFO = {
      1: { name: "Gói Khai Huyệt", price: "299.000đ" },
      2: { name: "Gói Nam Dược", price: "199.000đ" },
      3: { name: "Gói Tượng Số", price: "99.000đ" },
    }

    const packageInfo = PACKAGE_INFO[packageNumber]

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">Nội Dung Trả Phí</CardTitle>
            <CardDescription>Bạn cần thanh toán để truy cập {packageInfo.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-primary/50 bg-primary/10">
              <AlertDescription className="text-center">
                <div className="text-lg font-bold text-foreground mb-1">{packageInfo.name}</div>
                <div className="text-2xl font-bold text-primary">{packageInfo.price}</div>
              </AlertDescription>
            </Alert>

            <Button onClick={handlePaymentClick} className="w-full" size="lg">
              Thanh toán ngay
            </Button>

            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              Quay lại trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Has access - show content
  return <>{children}</>
}
