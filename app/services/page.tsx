"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { PaymentModal } from "@/components/payment-modal"
import { UserNav } from "@/components/user-nav"

export default function ServicesPage() {
  const router = useRouter()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<1 | 2 | 3 | null>(null)

  const handlePackageClick = (packageNumber: 1 | 2 | 3) => {
    setSelectedPackage(packageNumber)
    setShowPaymentModal(true)
  }

  const packages = [
    {
      id: 1,
      name: "Gói Khai Huyệt",
      price: 299000,
      description: "Hướng dẫn chi tiết các huyệt đạo và cách bấm huyệt theo Mai Hoa Dịch Số",
      features: [
        "Bản đồ huyệt đạo chi tiết",
        "Hướng dẫn cách bấm huyệt",
        "Lộ trình điều trị theo quẻ",
        "Video hướng dẫn",
        "Tư vấn trực tuyến 24/7",
      ],
      popular: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Gói Nam Dược",
      price: 199000,
      description: "Bài thuốc Nam Dược được kê theo Mai Hoa Dịch Số và Ngũ Hành",
      features: [
        "Bài thuốc cá nhân hóa",
        "50 vị thuốc Nam Dược",
        "Liều lượng chi tiết",
        "Cách sắc thuốc đúng cách",
        "Tư vấn điều chỉnh liều",
      ],
      popular: true,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      name: "Gói Tượng Số",
      price: 99000,
      description: "Phân tích tượng số và con số vận mệnh theo Mai Hoa",
      features: [
        "Phân tích số mệnh",
        "Dự báo vận trình",
        "Tư vấn phong thủy",
        "Chọn ngày giờ tốt",
        "Báo cáo chi tiết",
      ],
      popular: false,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
          </div>
          <UserNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <Badge variant="outline" className="mb-4">
          Các gói dịch vụ
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          Chọn gói phù hợp với bạn
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Khám phá sức khỏe qua Mai Hoa Dịch Số với các gói dịch vụ được thiết kế dành riêng cho bạn
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${pkg.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                  <span className="text-2xl font-bold text-white">{pkg.id}</span>
                </div>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-balance">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{pkg.price.toLocaleString("vi-VN")}đ</div>
                  <p className="text-sm text-muted-foreground mt-1">Thanh toán một lần</p>
                </div>

                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePackageClick(pkg.id as 1 | 2 | 3)}
                >
                  Bắt đầu ngay
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Chưa chắc chắn gói nào phù hợp?</CardTitle>
            <CardDescription className="text-base">
              Hãy bắt đầu gieo quẻ để chúng tôi gợi ý gói dịch vụ phù hợp nhất với tình trạng sức khỏe của bạn
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={() => router.push("/")}>
              Gieo quẻ miễn phí
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        packageNumber={selectedPackage}
        upper={1}
        lower={1}
        moving={1}
      />
    </div>
  )
}
