"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, FlaskConical, Clock, AlertTriangle, Info, Utensils, Heart, Download, ChevronRight } from "lucide-react"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { generateNamDuocPrescription, type NamDuocPrescription } from "@/lib/herbal-data-nam-duoc"
import { GatedContentWrapper } from "@/components/gated-content-wrapper"
import { PaymentModal } from "@/components/payment-modal"

function HerbalContent() {
  const searchParams = useSearchParams()
  const [prescription, setPrescription] = useState<NamDuocPrescription | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const upper = Number.parseInt(searchParams.get("upper") || "1")
  const lower = Number.parseInt(searchParams.get("lower") || "1")
  const moving = Number.parseInt(searchParams.get("moving") || "1")

  useEffect(() => {
    const result = generateNamDuocPrescription(upper, lower, moving)
    setPrescription(result)
  }, [upper, lower, moving])

  const upperTrigram = getTrigramByNumber(upper)
  const lowerTrigram = getTrigramByNumber(lower)

  const hexagramName = `${upperTrigram.vietnamese} ${lowerTrigram.vietnamese}`

  if (!prescription) {
    return <div className="text-center py-12">Đang tải...</div>
  }

  return (
    <>
      <GatedContentWrapper
        solutionType="herbal"
        hexagram={hexagramName}
        packageNumber={2}
        onPaymentRequired={() => setShowPaymentModal(true)}
      >
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          {/* Header */}
          <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Gói 2: Nam Dược Thần Hiệu</h1>
                  <p className="text-sm text-muted-foreground mt-1">Bài thuốc từ Tuệ Tĩnh - Ngũ Hành Điều Hòa</p>
                </div>
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                  Trang chủ
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Diagnosis Summary */}
              <Card className="border-primary/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Info className="w-5 h-5 text-primary" />
                    Chẩn Đoán Theo Ngũ Hành
                  </CardTitle>
                  <CardDescription>{prescription.indication}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Badge variant="secondary">
                      Thượng: {upperTrigram.vietnamese} ({upperTrigram.element} - {upperTrigram.organ})
                    </Badge>
                    <Badge variant="secondary">
                      Hạ: {lowerTrigram.vietnamese} ({lowerTrigram.element} - {lowerTrigram.organ})
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Main Prescription */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Leaf className="w-6 h-6 text-primary" />
                        {prescription.name}
                      </CardTitle>
                      <CardDescription className="mt-2">Theo lý thuyết Ngũ Hành từ Nam Dược Thần Hiệu</CardDescription>
                    </div>
                    <Badge variant="default" className="text-sm">
                      {prescription.formula.length} vị thuốc
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="ingredients" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="ingredients">Vị thuốc</TabsTrigger>
                      <TabsTrigger value="preparation">Cách sắc</TabsTrigger>
                      <TabsTrigger value="dosage">Liều dùng</TabsTrigger>
                      <TabsTrigger value="caution">Lưu ý</TabsTrigger>
                    </TabsList>

                    {/* Ingredients Tab */}
                    <TabsContent value="ingredients" className="space-y-4">
                      <div className="space-y-3">
                        {prescription.formula.map((item, idx) => (
                          <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-border">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-foreground">{item.herb.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {item.role}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                  <span>Vị: {item.herb.taste}</span>
                                  <span>•</span>
                                  <span>Tính: {item.herb.nature}</span>
                                  <span>•</span>
                                  <span>
                                    {item.herb.element} - {item.herb.organ}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-sm font-semibold ml-2">
                                {item.amount}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {item.herb.effects}
                            </p>
                            {item.herb.notes && (
                              <p className="text-xs text-muted-foreground/80 mt-2 italic pl-6">💡 {item.herb.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <Alert className="border-accent/50 bg-accent/10">
                        <Info className="h-4 w-4 text-accent" />
                        <AlertDescription className="ml-2">
                          <p className="font-semibold text-foreground mb-1">Thuyết minh bài thuốc:</p>
                          <p className="text-sm text-muted-foreground">
                            Bài thuốc này được xây dựng theo nguyên tắc Quân-Thần-Tá-Sứ trong Y học cổ truyền, kết hợp
                            lý thuyết Ngũ Hành tương sinh tương khắc để điều hòa âm dương trong cơ thể.
                          </p>
                        </AlertDescription>
                      </Alert>
                    </TabsContent>

                    {/* Preparation Tab */}
                    <TabsContent value="preparation" className="space-y-4">
                      <div className="space-y-3">
                        {prescription.preparation.map((step, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-muted-foreground leading-relaxed">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <FlaskConical className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Lưu ý khi sắc thuốc:</h4>
                        </div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Nên dùng nồi sành, tránh nồi kim loại</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Lửa to khi đun sôi, sau đó chuyển lửa nhỏ</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Không mở nắp quá nhiều lần trong quá trình sắc</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>

                    {/* Dosage Tab */}
                    <TabsContent value="dosage" className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                              <Clock className="w-5 h-5 text-primary" />
                              Liều Dùng
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{prescription.dosage}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-border/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                              <Clock className="w-5 h-5 text-primary" />
                              Thời Gian
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{prescription.duration}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-3">Lưu ý khi dùng thuốc:</h4>
                        <ul className="space-y-2">
                          {prescription.precautions.map((precaution, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{precaution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Alert className="border-primary/50 bg-primary/10">
                        <Info className="h-4 w-4 text-primary" />
                        <AlertDescription className="ml-2 text-sm text-muted-foreground">
                          Nếu sau 2 tuần không thấy cải thiện, nên tái khám để điều chỉnh phương thuốc phù hợp hơn theo
                          thể trạng cụ thể.
                        </AlertDescription>
                      </Alert>
                    </TabsContent>

                    {/* Caution Tab */}
                    <TabsContent value="caution" className="space-y-4">
                      <Alert className="border-destructive/50 bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <AlertDescription className="ml-2">
                          <p className="font-semibold text-foreground mb-2">Cảnh báo quan trọng:</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span>
                              <span>Phụ nữ có thai và cho con bú nên tham khảo thầy thuốc trước khi dùng</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span>
                              <span>Người bị cảm mạo, sốt cao không nên dùng thuốc bổ</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span>
                              <span>
                                Nếu có phản ứng bất thường (phát ban, buồn nôn), ngừng ngay và liên hệ thầy thuốc
                              </span>
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>

                      <Card className="border-border/50 bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg text-foreground">Quan Trọng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                          <p className="leading-relaxed">
                            Bài thuốc này được xây dựng dựa trên lý thuyết Ngũ Hành và chẩn đoán Mai Hoa, chỉ mang tính
                            chất tham khảo. Nên tham khảo ý kiến thầy thuốc Đông y có chuyên môn trước khi sử dụng.
                          </p>
                          <p className="leading-relaxed">
                            Mỗi cơ địa khác nhau cần phương thuốc điều chỉnh phù hợp. Không tự ý thay đổi liều lượng
                            hoặc vị thuốc.
                          </p>
                          <p className="leading-relaxed">
                            Bài thuốc được trích dẫn từ "Nam Dược Thần Hiệu" (Tuệ Tĩnh, 1883), một trong những tài liệu
                            quý giá của y học cổ truyền Việt Nam.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Dietary Advice & Lifestyle */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Utensils className="w-5 h-5 text-primary" />
                      Chế Độ Ăn Uống
                    </CardTitle>
                    <CardDescription>Hỗ trợ quá trình điều trị</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Ăn nhiều ngũ cốc nguyên hạt, rau xanh và trái cây</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Hạn chế thức ăn cay nóng, dầu mỡ, đồ chiên rán</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Tránh rượu bia, chất kích thích</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Ăn đúng giờ, không ăn quá no hoặc quá đói</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Heart className="w-5 h-5 text-primary" />
                      Lối Sống Lành Mạnh
                    </CardTitle>
                    <CardDescription>Cải thiện sức khỏe toàn diện</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Ngủ đủ 7-8 giờ mỗi đêm, không thức khuya</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Tập thể dục nhẹ nhàng như thái cực, khí công</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Tránh căng thẳng, lo lắng kéo dài</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Giữ ấm cơ thể, tránh gió lạnh</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Download Button */}
              <Card className="border-border/50 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">Tải Phương Thuốc PDF</h3>
                      <p className="text-sm text-muted-foreground">Bản in đầy đủ chi tiết để mang đến nhà thuốc</p>
                    </div>
                    <Button size="lg" className="gap-2">
                      <Download className="w-5 h-5" />
                      Tải xuống
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Section */}
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Dẫn chứng tài liệu:</strong> Các vị thuốc và bài thuốc trích dẫn
                    từ "Nam Dược Thần Hiệu" (Tuệ Tĩnh, 1883) - một trong những tài liệu y học cổ truyền quý giá của Việt
                    Nam. Lý thuyết Ngũ Hành và Tạng Phủ dựa trên "Hoàng Đế Nội Kinh" kết hợp với kinh nghiệm lâm sàng
                    hàng trăm năm. Hệ thống phân loại thuốc theo vị (mặn, chua, cay, đắng, ngọt) và tính (hàn, lương,
                    bình, ôn, nóng) giúp điều hòa âm dương trong cơ thể.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </GatedContentWrapper>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        packageNumber={2}
        upper={upper}
        lower={lower}
        moving={moving}
      />
    </>
  )
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function HerbalPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
      <HerbalContent />
    </Suspense>
  )
}
