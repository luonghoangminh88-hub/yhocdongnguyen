"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Copy, QrCode, RefreshCw, Smartphone, Monitor } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSolutionsByHexagram, getSolutionsByHexagramKey } from "@/lib/actions/solution-actions"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { formatTimoAccountNumber, TIMO_BANK_CODE } from "@/lib/timo-payment"
import type { TimoDeposit } from "@/lib/timo-payment"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  packageNumber: 1 | 2 | 3 | null
  upper: number
  lower: number
  moving: number
}

const PACKAGE_INFO = {
  1: {
    name: "Gói Khai Huyệt",
    price: "299.000đ",
    amount: 299000,
    route: "/treatment/acupressure",
    solutionType: "acupoint" as const,
  },
  2: {
    name: "Gói Nam Dược",
    price: "199.000đ",
    amount: 199000,
    route: "/treatment/herbal",
    solutionType: "prescription" as const,
  },
  3: {
    name: "Gói Tượng Số",
    price: "99.000đ",
    amount: 99000,
    route: "/treatment/numerology",
    solutionType: "numerology" as const,
  },
}

export function PaymentModal({ isOpen, onClose, packageNumber, upper, lower, moving }: PaymentModalProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [deposit, setDeposit] = useState<TimoDeposit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-create deposit when modal opens
  useEffect(() => {
    if (isOpen && packageNumber && !deposit && !isCreating) {
      handleCreateDeposit()
    }
  }, [isOpen, packageNumber])

  if (!packageNumber) return null

  const packageInfo = PACKAGE_INFO[packageNumber]

  const handleCreateDeposit = async () => {
    setError(null)
    setIsCreating(true)

    try {
      // Check authentication
      const { user } = await getCurrentUser()

      if (!user) {
        setError("Bạn cần đăng nhập để thanh toán")
        setIsCreating(false)
        return
      }

      const hexagramKey = `${upper}_${lower}_${moving}`

      // Get solution
      let { solutions, error: solutionError } = await getSolutionsByHexagramKey(hexagramKey)

      if (!solutions || solutions.length === 0) {
        const upperTrigram = getTrigramByNumber(upper)
        const lowerTrigram = getTrigramByNumber(lower)
        const hexagramName = `${upperTrigram.vietnamese} ${lowerTrigram.vietnamese}`

        const oldFormatResult = await getSolutionsByHexagram(hexagramName)
        solutions = oldFormatResult.solutions
        solutionError = oldFormatResult.error
      }

      if (solutionError || !solutions || solutions.length === 0) {
        setError("Không tìm thấy giải pháp cho quẻ này")
        setIsCreating(false)
        return
      }

      const solution = solutions.find((s) => s.solution_type === packageInfo.solutionType)

      if (!solution) {
        setError(`Không tìm thấy ${packageInfo.name} cho quẻ này`)
        setIsCreating(false)
        return
      }

      // Create Timo deposit
      const response = await fetch("/api/deposits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solution_id: solution.id,
          amount: packageInfo.amount,
        }),
      })

      const result = await response.json()

      console.log("[v0] Create deposit response:", result)

      if (!response.ok || result.error) {
        setError(result.error || "Không thể tạo giao dịch")
        setIsCreating(false)
        return
      }

      console.log("[v0] Deposit created:", result.deposit)
      console.log("[v0] QR URL:", result.deposit?.payment_data?.qr_url)

      setDeposit(result.deposit)
      setIsCreating(false)

      // Start polling for payment status
      startStatusPolling(result.deposit.id)
    } catch (err) {
      console.error("[v0] Payment error:", err)
      setError("Đã xảy ra lỗi trong quá trình tạo giao dịch")
      setIsCreating(false)
    }
  }

  const startStatusPolling = (depositId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/deposits/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deposit_id: depositId }),
        })

        const result = await response.json()

        if (result.deposit && result.deposit.status === "completed") {
          clearInterval(interval)
          setSuccess(true)

          // Redirect after showing success
          setTimeout(() => {
            onClose()
            const params = new URLSearchParams({
              upper: upper.toString(),
              lower: lower.toString(),
              moving: moving.toString(),
            })
            router.push(`${packageInfo.route}?${params.toString()}`)
            router.refresh()
          }, 2000)
        }
      } catch (err) {
        console.error("[v0] Error checking status:", err)
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateBankingDeepLink = () => {
    if (!deposit) return "#"

    // VietQR deep link format for universal banking apps
    const qrData = `${TIMO_BANK_CODE}${deposit.payment_data?.account_number}${deposit.amount}${deposit.payment_code}`

    // Try VietQR universal link first (works with most banking apps)
    return `https://dl.vietqr.io/pay?bankCode=${TIMO_BANK_CODE}&accountNumber=${deposit.payment_data?.account_number}&amount=${deposit.amount}&description=${encodeURIComponent(deposit.payment_code)}`
  }

  const handleRefreshStatus = async () => {
    if (!deposit) return

    setIsChecking(true)
    try {
      const response = await fetch("/api/deposits/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deposit_id: deposit.id }),
      })

      const result = await response.json()

      if (result.deposit) {
        setDeposit(result.deposit)

        if (result.deposit.status === "completed") {
          setSuccess(true)
          setTimeout(() => {
            onClose()
            const params = new URLSearchParams({
              upper: upper.toString(),
              lower: lower.toString(),
              moving: moving.toString(),
            })
            router.push(`${packageInfo.route}?${params.toString()}`)
            router.refresh()
          }, 2000)
        }
      }
    } catch (err) {
      console.error("[v0] Error refreshing status:", err)
    }
    setIsChecking(false)
  }

  // Success state
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Thanh Toán Thành Công!</h3>
              <p className="text-muted-foreground">Đang chuyển đến nội dung...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Show QR code if deposit created
  if (deposit) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="text-base sm:text-lg text-foreground">
              {isMobile ? "Chuyển Khoản Thanh Toán" : "Quét Mã QR Để Thanh Toán"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">{packageInfo.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-6 py-2 sm:py-4">
            {isMobile ? (
              <>
                {/* Mobile: Primary CTA button to open banking app */}
                <div className="space-y-2">
                  <Button
                    onClick={() => (window.location.href = generateBankingDeepLink())}
                    className="w-full h-11 sm:h-14 text-sm sm:text-lg font-semibold"
                    size="lg"
                  >
                    <Smartphone className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Mở App Ngân Hàng
                  </Button>

                  <p className="text-[10px] sm:text-xs text-center text-muted-foreground leading-tight">
                    Hoặc chuyển khoản thủ công với thông tin bên dưới
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Desktop: Show QR Code */}
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  {deposit.payment_data?.qr_url ? (
                    <img
                      src={deposit.payment_data.qr_url || "/placeholder.svg"}
                      alt="Mã QR thanh toán"
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-muted">
                      <QrCode className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Monitor className="w-4 h-4" />
                  <span>Quét bằng app ngân hàng trên điện thoại</span>
                </div>
              </>
            )}

            <div className="space-y-2 sm:space-y-3 bg-primary/5 p-3 sm:p-4 rounded-lg border-2 border-primary/20">
              <div className="text-center pb-1.5 sm:pb-2 border-b border-primary/20">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Thông tin chuyển khoản</p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Ngân hàng</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium text-foreground">Timo (Viet Capital Bank)</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Số tài khoản</p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="font-mono text-xs sm:text-sm font-medium text-foreground flex-1 break-all">
                      {formatTimoAccountNumber(deposit.payment_data?.account_number || "")}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(deposit.payment_data?.account_number || "", "account")}
                      className="h-7 sm:h-9 px-2 sm:px-3 flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs">{copied === "account" ? "✓" : ""}</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Tên chủ tài khoản</p>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{deposit.payment_data?.account_name}</p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Số tiền</p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="text-lg sm:text-2xl font-bold text-primary flex-1">
                      {deposit.amount.toLocaleString("vi-VN")} VND
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCopy(deposit.amount.toString(), "amount")}
                      className="h-7 sm:h-9 px-2 sm:px-3 flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs">{copied === "amount" ? "✓" : ""}</span>
                    </Button>
                  </div>
                </div>

                <div className="pt-1.5 sm:pt-2 border-t-2 border-primary/30">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                    <span className="text-red-500 font-bold">*</span> Nội dung chuyển khoản (Bắt buộc)
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <p className="font-mono font-bold text-sm sm:text-lg text-primary flex-1 bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded break-all">
                      {deposit.payment_code}
                    </p>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleCopy(deposit.payment_code, "code")}
                      className="h-8 sm:h-10 px-2 sm:px-3 flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                      <span className="text-[10px] sm:text-xs">{copied === "code" ? "✓" : "Copy"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Alert className="border-primary/20">
              <AlertDescription className="text-[11px] sm:text-sm leading-relaxed">
                <p className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Hướng dẫn thanh toán:</p>
                <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1.5 text-[10px] sm:text-sm">
                  {isMobile ? (
                    <>
                      <li>Nhấn nút "Mở App Ngân Hàng" phía trên</li>
                      <li>Hoặc mở app ngân hàng và chuyển khoản thủ công</li>
                    </>
                  ) : (
                    <li>Quét mã QR bằng app ngân hàng trên điện thoại</li>
                  )}
                  <li>
                    <strong className="text-red-600 font-bold">Nhập đúng nội dung: {deposit.payment_code}</strong>
                  </li>
                  <li>Xác nhận thanh toán đúng số tiền {deposit.amount.toLocaleString("vi-VN")}đ</li>
                  <li>Giao dịch sẽ được xác nhận tự động trong 1-5 phút</li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Status */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 animate-pulse flex-shrink-0" />
                <span className="text-[11px] sm:text-sm font-medium text-yellow-700 dark:text-yellow-400">Đang chờ thanh toán...</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleRefreshStatus} 
                disabled={isChecking}
                className="h-7 sm:h-8 px-1.5 sm:px-2 flex-shrink-0"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isChecking ? "animate-spin" : ""}`} />
                <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs">Kiểm tra</span>
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Initial state - show package info and create deposit button
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Thanh Toán</DialogTitle>
          <DialogDescription>{packageInfo.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Summary */}
          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
            <span className="font-medium text-foreground">{packageInfo.name}</span>
            <span className="text-2xl font-bold text-primary">{packageInfo.price}</span>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Button */}
          <Button onClick={handleCreateDeposit} disabled={isCreating} className="w-full" size="lg">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo mã QR...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Tạo mã QR thanh toán
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Thanh toán qua chuyển khoản ngân hàng Timo
            <br />
            Tự động xác nhận trong 1-5 phút
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
