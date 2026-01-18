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
import AppHeader from "@/components/app-header" // Declare the AppHeader variable
import { parseMarkdown } from "@/lib/markdown-parser" // Declare the parseMarkdown variable

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

  const downloadPDF = () => {
    console.log("[v0] Generating PDF:", prescription.name)
    
    // Create a hidden iframe for printing
    const printWindow = document.createElement('iframe')
    printWindow.style.position = 'fixed'
    printWindow.style.right = '0'
    printWindow.style.bottom = '0'
    printWindow.style.width = '0'
    printWindow.style.height = '0'
    printWindow.style.border = 'none'
    document.body.appendChild(printWindow)

    const doc = printWindow.contentDocument || printWindow.contentWindow?.document
    if (!doc) return

    // Generate beautiful PDF HTML with professional design
    const pdfHTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prescription.name} - Nam Dược Thần Hiệu</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      color: #1a1a1a;
      font-size: 11pt;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .header h1 {
      font-size: 24pt;
      color: #059669;
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .header .subtitle {
      font-size: 11pt;
      color: #047857;
      font-style: italic;
      margin-bottom: 5px;
    }
    
    .header .badge {
      display: inline-block;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 9pt;
      font-weight: bold;
      margin-top: 8px;
    }
    
    .diagnosis-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #059669;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .diagnosis-box h2 {
      font-size: 14pt;
      color: #047857;
      margin-bottom: 10px;
      border-bottom: 2px solid #059669;
      padding-bottom: 5px;
    }
    
    .diagnosis-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }
    
    .diagnosis-item {
      background: white;
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 4px solid #059669;
    }
    
    .diagnosis-item strong {
      color: #047857;
      font-weight: bold;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #047857;
      border-bottom: 2px solid #059669;
      padding-bottom: 6px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-title::before {
      content: "✦";
      color: #059669;
      font-size: 16pt;
    }
    
    .herb-list {
      display: grid;
      gap: 12px;
    }
    
    .herb-item {
      background: #f9fafb;
      border: 1px solid #d1d5db;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 12px;
      page-break-inside: avoid;
    }
    
    .herb-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .herb-name {
      font-size: 12pt;
      font-weight: bold;
      color: #1f2937;
    }
    
    .herb-amount {
      background: #059669;
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 10pt;
      font-weight: bold;
    }
    
    .herb-role {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 9pt;
      margin-left: 8px;
      font-weight: 600;
    }
    
    .herb-properties {
      font-size: 10pt;
      color: #6b7280;
      margin-bottom: 6px;
    }
    
    .herb-effects {
      font-size: 10pt;
      color: #374151;
      line-height: 1.5;
      margin-top: 6px;
      padding-left: 12px;
      border-left: 2px solid #d1d5db;
    }
    
    .step-list {
      display: grid;
      gap: 10px;
    }
    
    .step-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    
    .step-number {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 11pt;
    }
    
    .step-content {
      flex: 1;
      padding-top: 4px;
    }
    
    .info-box {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 12px;
      margin-top: 15px;
    }
    
    .info-box-title {
      font-weight: bold;
      color: #d97706;
      margin-bottom: 8px;
      font-size: 11pt;
    }
    
    .warning-box {
      background: #fee2e2;
      border: 2px solid #dc2626;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .warning-box .warning-title {
      font-size: 13pt;
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .warning-list {
      list-style: none;
      padding: 0;
    }
    
    .warning-list li {
      margin-bottom: 6px;
      padding-left: 20px;
      position: relative;
    }
    
    .warning-list li::before {
      content: "⚠";
      position: absolute;
      left: 0;
      color: #dc2626;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #d1d5db;
      font-size: 9pt;
      color: #6b7280;
      text-align: center;
    }
    
    .footer-references {
      margin-bottom: 10px;
      text-align: left;
      font-style: italic;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
    <div class="header">
    <h1>${prescription.name}</h1>
    <div class="subtitle">Nam Dược Thần Hiệu - Thái Y Tuệ Tĩnh (1883)</div>
    <div class="badge">${prescription.formula?.length || 0} Vị Thuốc Cổ Truyền</div>
  </div>

  <!-- Diagnosis Section -->
  <div class="diagnosis-box">
    <h2>Chẩn Đoán Theo Ngũ Hành</h2>
    <p style="margin-bottom: 10px; font-style: italic; color: #047857;">${prescription.indication || 'Điều trị theo nguyên tắc Ngũ Hành'}</p>
    <div class="diagnosis-info">
      <div class="diagnosis-item">
        <strong>Thượng Quẻ:</strong> ${upperTrigram?.vietnamese || 'N/A'} (${upperTrigram?.element || 'N/A'}, Kinh ${upperTrigram?.organ || 'N/A'})
      </div>
      <div class="diagnosis-item">
        <strong>Hạ Quẻ:</strong> ${lowerTrigram?.vietnamese || 'N/A'} (${lowerTrigram?.element || 'N/A'}, Kinh ${lowerTrigram?.organ || 'N/A'})
      </div>
    </div>
  </div>

  ${prescription.analysis ? `
  <!-- Analysis Section -->
  <div class="section">
    <div class="section-title">Phân Tích Từ Quẻ Dịch</div>
    <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; line-height: 1.8; white-space: pre-line;">
      ${prescription.analysis}
    </div>
  </div>
  ` : ''}

  <!-- Ingredients Section -->
  <div class="section">
    <div class="section-title">Thành Phần Vị Thuốc</div>
    <div class="herb-list">
      ${(prescription.formula || []).map((item, idx) => `
        <div class="herb-item">
          <div class="herb-header">
            <div>
              <span class="herb-name">${idx + 1}. ${item.herb.name}</span>
              <span class="herb-role">${item.role}</span>
            </div>
            <div class="herb-amount">${item.amount}</div>
          </div>
          <div class="herb-properties">
            <strong>Vị:</strong> ${item.herb.taste} | <strong>Tính:</strong> ${item.herb.nature} | 
            <strong>Quy kinh:</strong> ${item.herb.element} - ${item.herb.organ}
          </div>
          <div class="herb-effects">${item.herb.effects}</div>
          ${item.herb.notes ? `<div style="font-size: 9pt; color: #6b7280; margin-top: 6px; font-style: italic;">💡 ${item.herb.notes}</div>` : ''}
        </div>
      `).join('')}
    </div>
    
    <div class="info-box">
      <div class="info-box-title">📖 Thuyết minh bài thuốc</div>
      <p style="font-size: 10pt; line-height: 1.5;">
        Bài thuốc này được xây dựng theo nguyên tắc <strong>Quân-Thần-Tá-Sứ</strong> trong Y học cổ truyền, 
        kết hợp lý thuyết Ngũ Hành tương sinh tương khắc để điều hòa âm dương trong cơ thể.
      </p>
    </div>
  </div>

  <!-- Preparation Section -->
  <div class="section">
    <div class="section-title">Cách Sắc Thuốc</div>
    <div class="step-list">
      ${(prescription.preparation || []).map((step, idx) => `
        <div class="step-item">
          <div class="step-number">${idx + 1}</div>
          <div class="step-content">${step}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="info-box" style="margin-top: 15px;">
      <div class="info-box-title">🔥 Lưu ý khi sắc thuốc</div>
      <ul style="font-size: 10pt; line-height: 1.6; padding-left: 20px; margin-top: 8px;">
        <li>Nên dùng nồi sành, tránh nồi kim loại</li>
        <li>Lửa to khi đun sôi, sau đó chuyển lửa nhỏ</li>
        <li>Không mở nắp quá nhiều lần trong quá trình sắc</li>
      </ul>
    </div>
  </div>

  <!-- Dosage Section -->
  <div class="section">
    <div class="section-title">Liều Dùng & Thời Gian</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
      <div style="background: #f0fdf4; border: 1px solid #059669; border-radius: 8px; padding: 12px;">
        <div style="font-weight: bold; color: #047857; margin-bottom: 6px;">💊 Liều Dùng</div>
        <p style="font-size: 10pt; line-height: 1.5;">${prescription.dosage || 'Theo chỉ dẫn thầy thuốc'}</p>
      </div>
      <div style="background: #f0fdf4; border: 1px solid #059669; border-radius: 8px; padding: 12px;">
        <div style="font-weight: bold; color: #047857; margin-bottom: 6px;">⏰ Thời Gian</div>
        <p style="font-size: 10pt; line-height: 1.5;">${prescription.duration || '7-14 ngày hoặc theo chỉ dẫn'}</p>
      </div>
    </div>
    
    ${(prescription.precautions && prescription.precautions.length > 0) ? `
    <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px;">
      <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">📋 Lưu ý khi dùng thuốc:</div>
      <ul style="font-size: 10pt; line-height: 1.6; padding-left: 20px;">
        ${prescription.precautions.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>

  <!-- Warnings Section -->
  <div class="warning-box">
    <div class="warning-title">⚠️ CẢNH BÁO QUAN TRỌNG</div>
    <p style="text-align: center; font-weight: bold; margin-bottom: 10px; color: #991b1b;">
      THAM VẤN Ý KIẾN THẦY THUỐC TRƯỚC KHI SỬ DỤNG
    </p>
    <p style="font-size: 10pt; margin-bottom: 10px; line-height: 1.5;">
      Đây là bài thuốc mang tính chất tham khảo, được xây dựng trên lý thuyết Ngũ Hành và chẩn đoán Mai Hoa Dịch Số. 
      Mỗi cơ địa người bệnh khác nhau, cần có sự điều chỉnh phù hợp từ thầy thuốc có chuyên môn.
    </p>
    <ul class="warning-list" style="font-size: 10pt;">
      <li>Phụ nữ có thai và cho con bú: BẮT BUỘC tham khảo thầy thuốc trước khi dùng</li>
      <li>Người bị cảm mạo, sốt cao: KHÔNG dùng thuốc bổ</li>
      <li>Nếu có phản ứng bất thường (phát ban, buồn nôn, khó thở): NGỪNG NGAY và liên hệ cơ sở y tế</li>
      ${(prescription.warnings || []).map(w => `<li>${w}</li>`).join('')}
    </ul>
  </div>

  ${(prescription.contraindications && prescription.contraindications.length > 0) ? `
  <div class="section">
    <div class="section-title">Chống Chỉ Định</div>
    <ul style="font-size: 10pt; line-height: 1.6; padding-left: 20px;">
      ${prescription.contraindications.map(c => `<li style="margin-bottom: 6px;">${c}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-references">
      <strong>Dẫn chứng tài liệu:</strong><br>
      • Các vị thuốc và bài thuốc trích dẫn từ "Nam Dược Thần Hiệu" (Tuệ Tĩnh, 1883)<br>
      • Lý thuyết Ngũ Hành và Tạng Phủ dựa trên "Hoàng Đế Nội Kinh"<br>
      • Kết hợp Mai Hoa Dịch Số để chẩn đoán
    </div>
    <div>Bản in: ${new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  </div>
</body>
</html>
    `

    doc.open()
    doc.write(pdfHTML)
    doc.close()

    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.contentWindow?.focus()
      printWindow.contentWindow?.print()
      
      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(printWindow)
        console.log("[v0] PDF generation completed")
      }, 1000)
    }, 500)
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
          {/* Unified App Header */}
          <AppHeader
            showHomeButton
            badges={{
              primary: "Nam Dược Thần Hiệu - Tuệ Tĩnh",
              secondary: "Y Học Cổ Truyền Việt Nam",
            }}
          />

          {/* Page Title Section */}
          <div className="border-b border-border/40 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
            <div className="container mx-auto px-4 py-6 md:py-8">
              <h1 className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-emerald-900 dark:text-emerald-100 mb-2">
                Gói 2: Nam Dược Thần Hiệu
              </h1>
              <p className="text-sm md:text-base text-emerald-700 dark:text-emerald-300 max-w-2xl leading-relaxed">
                Bài thuốc được xây dựng từ lý thuyết Ngũ Hành kết hợp chẩn đoán Mai Hoa Dịch Số, 
                trích từ "Nam Dược Thần Hiệu" của Thái Y Tuệ Tĩnh (1883)
              </p>
              
              {/* Marketing message */}
              <div className="mt-3 md:mt-4 flex items-start gap-2 text-xs md:text-sm text-emerald-600 dark:text-emerald-400">
                <div className="w-1 h-1 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                <span className="font-medium leading-relaxed">Trí tuệ Mai Hoa Dịch Số + Y thuật Tuệ Tĩnh = Phương thuốc riêng cho bạn</span>
              </div>
            </div>
          </div>

          <main className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Diagnosis Summary */}
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                    <Info className="w-5 h-5 text-emerald-600" />
                    Chẩn Đoán Theo Ngũ Hành
                  </CardTitle>
                  <CardDescription className="text-emerald-700 dark:text-emerald-300">{prescription.indication}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        Thượng Quẻ: {upperTrigram.vietnamese}
                      </Badge>
                      <Badge variant="outline" className="border-blue-600 text-blue-700 dark:text-blue-400">
                        {upperTrigram.element}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Kinh {upperTrigram.organ}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        Hạ Quẻ: {lowerTrigram.vietnamese}
                      </Badge>
                      <Badge variant="outline" className="border-purple-600 text-purple-700 dark:text-purple-400">
                        {lowerTrigram.element}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Kinh {lowerTrigram.organ}
                      </Badge>
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* Hexagram Analysis Section - NEW */}
            {prescription.analysis && (
              <Card className="border-amber-200 dark:border-amber-800 shadow-lg bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-600">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    Phân Tích Từ Quẻ Dịch
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300">
                    Giải thích cách lựa chọn bài thuốc dựa trên lý thuyết Ngũ Hành và Mai Hoa Dịch Số
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-amber">
                    <div 
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(prescription.analysis) }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Prescription */}
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-background">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Leaf className="w-7 h-7 text-emerald-600" />
                        <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1">
                          Phương Thuốc Cổ Truyền
                        </Badge>
                      </div>
                      <CardTitle className="text-3xl font-serif font-bold text-emerald-900 dark:text-emerald-100 leading-tight">
                        {prescription.name}
                      </CardTitle>
                      <CardDescription className="mt-3 text-base text-emerald-700 dark:text-emerald-300">
                        Theo lý thuyết Ngũ Hành từ <span className="font-semibold">Nam Dược Thần Hiệu</span> (Tuệ Tĩnh, 1883)
                      </CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-base px-4 py-2 flex-shrink-0">
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
                    <TabsContent value="caution" className="space-y-6">
                      {/* Legal Warning - Prominent */}
                      <Alert className="border-2 border-red-600 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <AlertDescription className="ml-2">
                          <p className="font-bold text-red-900 dark:text-red-100 text-lg mb-3">
                            ⚠️ THAM VẤN Ý KIẾN THẦY THUỐC TRƯỚC KHI SỬ DỤNG
                          </p>
                          <p className="text-sm text-red-800 dark:text-red-200 mb-3 font-medium leading-relaxed">
                            Đây là bài thuốc mang tính chất tham khảo, được xây dựng trên lý thuyết Ngũ Hành và chẩn đoán Mai Hoa Dịch Số. 
                            Mỗi cơ địa người bệnh khác nhau, cần có sự điều chỉnh phù hợp từ thầy thuốc có chuyên môn.
                          </p>
                          <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5 font-bold">•</span>
                              <span className="font-medium">Phụ nữ có thai và cho con bú: BẮT BUỘC tham khảo thầy thuốc trước khi dùng</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5 font-bold">•</span>
                              <span className="font-medium">Người bị cảm mạo, sốt cao: KHÔNG dùng thuốc bổ</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5 font-bold">•</span>
                              <span className="font-medium">
                                Nếu có phản ứng bất thường (phát ban, buồn nôn, khó thở): NGỪNG NGAY và liên hệ cơ sở y tế
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5 font-bold">•</span>
                              <span className="font-medium">KHÔNG tự ý thay đổi liều lượng hoặc vị thuốc</span>
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>

                      {/* Source & Credibility */}
                      <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-background">
                        <CardHeader>
                          <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-emerald-600" />
                            Nguồn Tham Khảo
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          <div className="p-4 bg-white dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <p className="font-bold text-emerald-900 dark:text-emerald-100 text-base mb-2">
                              "Nam Dược Thần Hiệu"
                            </p>
                            <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed mb-1">
                              Tác giả: <span className="font-semibold">Thái Y Tuệ Tĩnh</span>
                            </p>
                            <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                              Xuất bản: <span className="font-semibold">1883</span>
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 italic">
                              Một trong những tài liệu quý giá nhất của Y học cổ truyền Việt Nam
                            </p>
                          </div>
                          
                          <div className="space-y-2 text-emerald-700 dark:text-emerald-300">
                            <p className="leading-relaxed flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>
                                Bài thuốc được xây dựng theo nguyên tắc <span className="font-semibold">Quân-Thần-Tá-Sứ</span> trong Y học cổ truyền
                              </span>
                            </p>
                            <p className="leading-relaxed flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>
                                Kết hợp <span className="font-semibold">lý thuyết Ngũ Hành</span> tương sinh tương khắc để điều hòa âm dương
                              </span>
                            </p>
                            <p className="leading-relaxed flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>
                                Chẩn đoán qua <span className="font-semibold">Mai Hoa Dịch Số</span> để xác định thể trạng ngũ hành cá nhân
                              </span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* USP Marketing Message */}
                      <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 via-yellow-50 to-white dark:from-amber-950/20 dark:via-yellow-950/20 dark:to-background">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                              <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-amber-900 dark:text-amber-100 text-lg mb-2">
                                Điểm Độc Nhất Của Hệ Thống
                              </h4>
                              <p className="text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                                Chúng tôi kết hợp <span className="font-semibold">trí tuệ Mai Hoa Dịch Số</span> nghìn năm 
                                với <span className="font-semibold">Y thuật Tuệ Tĩnh</span> để tạo ra phương thuốc 
                                riêng biệt dành cho từng cá nhân.
                              </p>
                              <div className="grid gap-2">
                                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                                  <span>Mai Hoa Dịch Số: Chẩn đoán thể trạng ngũ hành</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                                  <span>Nam Dược Thần Hiệu: Bài thuốc điều hòa cổ truyền</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                                  <span>Kết quả: Phương thuốc cá nhân hóa theo cơ địa</span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                    <Button size="lg" className="gap-2" onClick={downloadPDF}>
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
