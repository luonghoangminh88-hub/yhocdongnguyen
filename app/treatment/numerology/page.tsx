"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Clock, Target, Heart, Info, Download, Volume2, Smartphone, ChevronRight } from "lucide-react"
import { getTrigramByNumber } from "@/lib/data/trigram-data"
import { getNumerologyTreatment } from "@/lib/numerology-data"
import { GatedContentWrapper } from "@/components/gated-content-wrapper"
import { PaymentModal } from "@/components/payment-modal"

function NumerologyContent() {
  const searchParams = useSearchParams()
  const [treatment, setTreatment] = useState<ReturnType<typeof getNumerologyTreatment> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const upper = Number.parseInt(searchParams.get("upper") || "1")
  const lower = Number.parseInt(searchParams.get("lower") || "1")
  const moving = Number.parseInt(searchParams.get("moving") || "1")

  useEffect(() => {
    const result = getNumerologyTreatment(upper, lower, moving)
    setTreatment(result)
  }, [upper, lower, moving])

  const upperTrigram = getTrigramByNumber(upper)
  const lowerTrigram = getTrigramByNumber(lower)

  const hexagramName = `${upperTrigram.vietnamese} ${lowerTrigram.vietnamese}`

  if (!treatment) {
    return <div className="text-center py-12">Đang tải...</div>
  }

  const sequence = treatment.primarySequence

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản')
      return
    }

    setIsPlaying(true)
    
    // Get the number sequence
    const numbers = sequence.sequence.split(" ")
    const numberWords = numbers.map(num => {
      const map: Record<string, string> = {
        '0': 'không',
        '1': 'một',
        '2': 'hai',
        '3': 'ba',
        '4': 'bốn',
        '5': 'năm',
        '6': 'sáu',
        '7': 'bảy',
        '8': 'tám',
        '9': 'chín'
      }
      return map[num] || num
    })

    // Create speech
    const utterance = new SpeechSynthesisUtterance(numberWords.join('... ') + '...')
    utterance.lang = 'vi-VN'
    utterance.rate = 0.7 // Slower for meditation
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      alert('Không thể phát âm thanh. Vui lòng thử lại.')
    }

    window.speechSynthesis.cancel() // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance)
  }

  return (
    <>
      <GatedContentWrapper
        solutionType="numerology"
        hexagram={hexagramName}
        packageNumber={3}
        onPaymentRequired={() => setShowPaymentModal(true)}
      >
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          {/* Header */}
          <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Gói 3: Tượng Số Bát Quái</h1>
                  <p className="text-sm text-muted-foreground mt-1">Liệu pháp chữa bệnh bằng số</p>
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
                    Chẩn Đoán
                  </CardTitle>
                  <CardDescription>{treatment.diagnosis}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Badge variant="secondary">
                      Thượng: {upperTrigram.vietnamese} ({upperTrigram.element})
                    </Badge>
                    <Badge variant="secondary">
                      Hạ: {lowerTrigram.vietnamese} ({lowerTrigram.element})
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Main Number Sequence Display */}
              <Card className="border-border/50 shadow-xl bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-foreground text-xl">
                        <Sparkles className="w-6 h-6 text-primary" />
                        {sequence.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base">{sequence.description}</CardDescription>
                    </div>
                    <Badge variant="default" className="text-sm">
                      {sequence.element}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Number Display */}
                  <div
                    className="relative p-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${treatment.wallpaperColors.primary}15 0%, ${treatment.wallpaperColors.secondary} 100%)`,
                      border: `2px solid ${treatment.wallpaperColors.primary}40`,
                    }}
                  >
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-6">
                        {sequence.sequence.split(" ").map((num, idx) => (
                          <div key={idx} className="relative group">
                            <div
                              className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-2xl transition-transform group-hover:scale-110"
                              style={{
                                background: treatment.wallpaperColors.primary,
                                color: '#ffffff', // Always use white text for maximum contrast
                              }}
                            >
                              {num}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary/20 animate-ping"></div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handlePlayAudio}
                        variant="outline"
                        size="lg"
                        className="gap-2 mt-6 bg-transparent"
                        disabled={isPlaying}
                      >
                        <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                        {isPlaying ? "Đang phát..." : "Nghe cách niệm"}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground text-sm">Tần Suất</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">{sequence.frequency}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground text-sm">Thời Gian</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">{sequence.duration}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground text-sm">Tạng Phủ</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">{sequence.targetOrgans.join(", ")}</p>
                    </div>
                  </div>

                  {/* Effects */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <h4 className="font-semibold text-foreground mb-3">Công Dụng Chính:</h4>
                    <ul className="space-y-2">
                      {sequence.effects.map((effect, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best Time */}
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                    <h4 className="font-semibold text-foreground mb-2">Thời Gian Tốt Nhất:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sequence.bestTime.map((time, idx) => (
                        <Badge key={idx} variant="outline" className="bg-background">
                          {time}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Niệm vào các khung giờ này sẽ tăng hiệu quả điều trị
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Hướng Dẫn Chi Tiết</CardTitle>
                  <CardDescription>Cách thực hiện đúng để đạt hiệu quả tối ưu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* How to Chant */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-primary" />
                      Cách Niệm Số
                    </h4>
                    <div className="space-y-3">
                      {treatment.instructions.howToChant.map((instruction, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed pt-0.5">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Posture */}
                  <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Tư Thế:</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{treatment.instructions.posture}</p>
                  </div>

                  {/* Breathing */}
                  <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Hơi Thở:</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{treatment.instructions.breathing}</p>
                  </div>

                  {/* Mindset */}
                  <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Tâm Thế:</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{treatment.instructions.mindset}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Sequences */}
              {treatment.secondarySequences.length > 0 && (
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Dãy Số Hỗ Trợ</CardTitle>
                    <CardDescription>Có thể kết hợp hoặc luân phiên với dãy số chính</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {treatment.secondarySequences.map((altSeq, idx) => (
                      <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{altSeq.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{altSeq.description}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xl font-bold text-primary">
                            {altSeq.sequence.split(" ").map((num, numIdx) => (
                              <span key={numIdx}>{num}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Target className="w-3 h-3" />
                          <span>{altSeq.targetOrgans.join(", ")}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Wallpaper Preview */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Hình Nền Điện Thoại
                  </CardTitle>
                  <CardDescription>Đặt làm hình nền để nhắc nhở thực hiện liệu pháp mỗi ngày</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="relative w-full aspect-[9/16] max-w-sm mx-auto rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8"
                    style={{
                      background: `linear-gradient(135deg, ${treatment.wallpaperColors.primary} 0%, ${treatment.wallpaperColors.secondary} 100%)`,
                    }}
                  >
                    <div className="text-center space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-2" style={{ color: treatment.wallpaperColors.text }}>
                          {sequence.title}
                        </h3>
                        <p className="text-sm opacity-80" style={{ color: treatment.wallpaperColors.text }}>
                          {sequence.element}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-6">
                        {sequence.sequence.split(" ").map((num, idx) => (
                          <div
                            key={idx}
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg"
                            style={{
                              backgroundColor: `${treatment.wallpaperColors.text}20`,
                              color: treatment.wallpaperColors.text,
                              border: `2px solid ${treatment.wallpaperColors.text}40`,
                            }}
                          >
                            {num}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium" style={{ color: treatment.wallpaperColors.text }}>
                          {sequence.frequency}
                        </p>
                        <p className="text-xs opacity-70" style={{ color: treatment.wallpaperColors.text }}>
                          {sequence.targetOrgans.join(" • ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="w-full gap-2">
                    <Download className="w-5 h-5" />
                    Tải Hình Nền
                  </Button>
                </CardContent>
              </Card>

              {/* Important Note */}
              <Alert className="border-primary/50 bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-foreground mb-2">Lưu Ý Quan Trọng:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Thực hiện đều đặn mỗi ngày để đạt hiệu quả tốt nhất</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Giữ tâm thanh tịnh, tập trung khi niệm số</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Kết hợp với chế độ ăn uống và sinh hoạt lành mạnh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Liệu pháp này hỗ trợ điều trị, không thay thế thuốc hoặc y tế chính thống</span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Evidence Section */}
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Dẫn chứng tài liệu:</strong> Liệu pháp Tượng Số Bát Quái dựa
                    trên lý thuyết Kinh Dịch và ứng dụng của Lý Ngọc Sơn (Trung Quốc) trong "Bát Quái Tượng Số Liệu
                    Pháp". Các dãy số được thiết kế dựa trên nguyên lý tương sinh tương khắc của Ngũ Hành, mối quan hệ
                    Bát Quái với Tạng Phủ trong "Hoàng Đế Nội Kinh", và nghiên cứu về tần số âm thanh ảnh hưởng đến cơ
                    thể. Phương pháp này đã được áp dụng tại nhiều cơ sở y học cổ truyền với kết quả tích cực.
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
        packageNumber={3}
        upper={upper}
        lower={lower}
        moving={moving}
      />
    </>
  )
}

export default function NumerologyPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Đang tải...</div>}>
      <NumerologyContent />
    </Suspense>
  )
}
