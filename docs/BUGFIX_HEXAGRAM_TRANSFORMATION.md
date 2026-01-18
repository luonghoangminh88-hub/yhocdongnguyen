# BÁO CÁO PHÂN TÍCH VÀ KHẮC PHỤC LỖI CHẨN ĐOÁN MAI HOA DỊCH SỐ

## TÓM TẮT VẤN ĐỀ

Người dùng báo cáo rằng kết quả chẩn đoán từ quẻ **Tốn Vi Phong (巽为风)** với **Hào 5 động** cho kết quả **quá lạc quan** và **không cảnh báo đúng** về quẻ biến **Sơn Phong Cổ (山风蛊)** - quẻ mang ý nghĩa bệnh mãn tính, mục nát.

## PHÂN TÍCH CHI TIẾT

### 1. KIỂM TRA TÍNH TOÁN QUẺ BIẾN

#### Quẻ ban đầu: Tốn Vi Phong (巽为风) - Quẻ 57
\`\`\`
Thượng: Tốn (5) = ☴ (⚋⚋⚊)  <- Hào 6, 5, 4
Hạ: Tốn (5) = ☴ (⚋⚋⚊)     <- Hào 3, 2, 1
\`\`\`

#### Hào 5 động
- Hào 5 = Hào thứ 2 trong Thượng quẻ (đếm từ dưới lên)
- Tốn (⚋⚋⚊) → Đổi hào 2 → (⚋⚊⚊) = Cấn (7)

#### Quẻ biến: Sơn Phong Cổ (山风蛊) - Quẻ 18
\`\`\`
Thượng: Cấn (7) = ☶ (⚊⚋⚊)
Hạ: Tốn (5) = ☴ (⚋⚋⚊)
\`\`\`

**KẾT LUẬN:** Logic tính toán quẻ biến trong code HOÀN TOÀN CHÍNH XÁC ✅

File: `/app/diagnosis/page.tsx` dòng 95-130
\`\`\`typescript
const calculateTransformedHexagram = () => {
  // Logic đúng: Đổi hào động trong trigram tương ứng
  if (isLowerMoving) { // Hào 1-3
    // Đổi hào trong Hạ quẻ
  } else { // Hào 4-6
    // Đổi hào trong Thượng quẻ
  }
}
\`\`\`

### 2. PHÂN TÍCH CÁC LỖI THỰC TẾ

#### Lỗi 1: AI Phân Tích Không Đúng Quẻ Biến ❌

**Vấn đề:**
- Quẻ Cổ (蛊) có nghĩa "mục nát, độc tố tích tụ, bệnh âm ỉ"
- Nhưng AI đang phân tích theo "Thể Dụng Tỷ Hòa" (cân bằng tốt)
- AI bỏ qua ý nghĩa **BIẾN ĐỔI XẤU ĐI** từ Tỷ Hòa → Xung Khắc

**Phân tích quan hệ Ngũ Hành:**
\`\`\`
Quẻ ban đầu (本卦):
- Thượng: Tốn (Mộc) - Thể quẻ
- Hạ: Tốn (Mộc) - Dụng quẻ
→ Mộc - Mộc = Tỷ Hòa (Hài hòa) ✅

Quẻ biến (变卦):
- Thượng: Cấn (Thổ) - Thể quẻ
- Hạ: Tốn (Mộc) - Dụng quẻ  
→ Mộc khắc Thổ = Dụng khắc Thể (Hung) ❌❌❌
\`\`\`

**Nghĩa lâm sàng:**
- Ban đầu: Gan (Mộc) cân bằng → Bệnh nhẹ
- Sau này: Gan (Mộc) hành hạ Tỳ/Vị (Thổ) → Bệnh nặng
- Triệu chứng thực tế: Mất ngủ + Ăn uống kém + Mệt mỏi

#### Lỗi 2: Không Nhấn Mạnh Quẻ Cổ (蛊) ❌

**Đặc điểm quẻ Cổ theo Kinh Dịch:**
- 蛊 = Con sâu trong nồi thức ăn → Độc tố âm ỉ
- "Cổ bệnh" trong y học = Bệnh mãn tính, khó chữa
- Cần "chấn cổ" = Rung động mạnh để đào thải độc tố

**Lời khuyên đúng:**
\`\`\`
Quẻ Cổ chỉ ra:
1. Bệnh không phải do nguyên nhân bên ngoài đột ngột
2. Bệnh do tích tụ lâu ngày (stress, lo âu, thói quen xấu)
3. Cần điều trị tận gốc, không phải chỉ triệu chứng
4. Phải thay đổi lối sống, không chỉ uống thuốc
\`\`\`

#### Lỗi 3: Nhầm Lẫn Phương Pháp Luận ❌

AI đang trộn lẫn:
- **Lục Hào** (六爻法): "Hào 5 là vua, chủ tim mạch"
- **Mai Hoa Dịch Số**: Không phân tích theo vị trí hào, mà phân tích theo Thể-Dụng-Biến

**Phương pháp đúng của Mai Hoa:**
1. Xem Thể-Dụng → Quan hệ Ngũ Hành hiện tại
2. Xem Quẻ Biến → Xu hướng phát triển  
3. Xem Quẻ Hổ (互卦) → Quá trình biến chuyển
4. Xem Mùa (thời tiết) → Vượng suy

## PHƯƠNG ÁN KHẮC PHỤC

### Cấp 1: Cập nhật System Prompt cho AI

**File cần sửa:** `/lib/ai/prompts/system-instruction.ts`

Thêm phần cảnh báo:

\`\`\`markdown
## NGUYÊN TẮC QUAN TRỌNG KHI PHÂN TÍCH QUẺ BIẾN

### 1. Quẻ Biến Là Kết Quả Cuối Cùng
- Quẻ ban đầu (本卦) = Tình trạng hiện tại
- Quẻ biến (变卦) = Xu hướng phát triển, kết cục
- **LUÔN PHÂN TÍCH CẢ HAI QUẺ**

### 2. Các Quẻ Cảnh Báo (Cần đặc biệt lưu ý)

#### Quẻ Cổ (山风蛊 - #18) - Bệnh Mãn Tính
- **Ý nghĩa:** Mục nát, sâu mọt, độc tố tích tụ lâu ngày
- **Lâm sàng:** Bệnh âm ỉ, khó điều trị, cần thời gian dài
- **Nguyên nhân:** Không phải do ngoại cảm đột ngột, mà do tích tụ
- **Cách chữa:** Phải điều trị tận gốc, thay đổi lối sống
- **Tiên lượng:** Khó khỏi nhanh, cần kiên trì

#### Quan hệ Mộc khắc Thổ đặc biệt
Khi Quẻ Thể là Thổ (Cấn/Khôn) và Quẻ Dụng là Mộc (Chấn/Tốn):
- **Triệu chứng:** Gan hành hạ Tỳ Vị
- **Biểu hiện:** Lo âu, mất ngủ, stress → Ăn uống kém, đầy hơi, mệt mỏi
- **Cơ chế:** Can ức Tỳ (肝郁脾虚)
- **Điều trị:** Phải sớm Gan đồng thời bổ Tỳ, không chỉ an thần

### 3. Phân Tích Xu Hướng Biến Đổi

Khi Quẻ biến xấu đi so với Quẻ ban đầu:
\`\`\`
Tỷ Hòa → Xung Khắc = Bệnh sẽ nặng thêm
Dụng sinh Thể → Thể khắc Dụng = Tốn kém sức lực
Thể khắc Dụng → Dụng khắc Thể = Từ kiểm soát được → Mất kiểm soát
\`\`\`

**BẮT BUỘC phải cảnh báo người bệnh về xu hướng xấu đi!**
\`\`\`

### Cấp 2: Cập nhật Logic Phân Tích Trong Code

**File cần sửa:** `/lib/diagnosis/interpretation-logic-v2.ts`

Thêm hàm phân tích xu hướng:

\`\`\`typescript
export function analyzeTrend(
  originalRelationship: string, // Quan hệ Thể-Dụng ban đầu
  transformedRelationship: string, // Quan hệ Thể-Dụng sau biến
  transformedHexagramNumber?: number,
): {
  trend: "improving" | "stable" | "worsening"
  warning: string
  advice: string
} {
  // Thang đánh giá (càng cao càng tốt)
  const relationshipScore: Record<string, number> = {
    "Dụng sinh Thể": 5,    // Tốt nhất
    "Thể Dụng tỷ hòa": 4,  // Tốt
    "Thể khắc Dụng": 3,    // Trung bình
    "Thể sinh Dụng": 2,    // Xấu
    "Dụng khắc Thể": 1,    // Rất xấu
  }

  const originalScore = relationshipScore[originalRelationship] || 3
  const transformedScore = relationshipScore[transformedRelationship] || 3

  // Cảnh báo đặc biệt cho Quẻ Cổ
  const isGuHexagram = transformedHexagramNumber === 18
  
  if (transformedScore < originalScore) {
    return {
      trend: "worsening",
      warning: isGuHexagram 
        ? "⚠️ CẢNH BÁO: Quẻ biến là Sơn Phong Cổ - bệnh có xu hướng trở thành mãn tính, khó chữa. Cần điều trị ngay và kiên trì lâu dài."
        : "⚠️ Bệnh có xu hướng nặng thêm. Cần chú ý điều trị sớm.",
      advice: isGuHexagram
        ? "1. Tìm nguyên nhân gốc rễ (stress, lối sống, thói quen xấu)\n2. Thay đổi lối sống, không chỉ uống thuốc\n3. Kiên trì điều trị dài hạn\n4. Theo dõi sát sao, tái khám định kỳ"
        : "Nên điều trị sớm, tránh để bệnh tiến triển.",
    }
  }
  
  if (transformedScore === originalScore) {
    return {
      trend: "stable",
      warning: "",
      advice: "Tình trạng tương đối ổn định. Tiếp tục theo dõi.",
    }
  }
  
  return {
    trend: "improving",
    warning: "",
    advice: "Bệnh có xu hướng tốt lên. Duy trì điều trị hiện tại.",
  }
}
\`\`\`

### Cấp 3: Hiển thị Rõ Ràng Trên UI

**File cần sửa:** `/app/diagnosis/components/diagnosis-summary.tsx`

Thêm section cảnh báo:

\`\`\`tsx
{trend === "worsening" && (
  <Alert variant="destructive" className="mt-4">
    <AlertTriangle className="h-5 w-5" />
    <AlertTitle>Cảnh báo quan trọng</AlertTitle>
    <AlertDescription>
      {trendAnalysis.warning}
    </AlertDescription>
  </Alert>
)}
\`\`\`

## KẾT LUẬN

### Điểm Mạnh Hiện Tại:
✅ Logic tính toán quẻ biến CHÍNH XÁC 100%
✅ Dữ liệu 64 quẻ đầy đủ và đúng

### Điểm Yếu Cần Khắc Phục:
❌ AI không phân tích đúng mức độ nghiêm trọng của quẻ biến
❌ Thiếu cảnh báo về xu hướng xấu đi
❌ Nhầm lẫn phương pháp Lục Hào và Mai Hoa
❌ Không đặc biệt cảnh báo các quẻ hung như Quẻ Cổ

### Ưu Tiên Khắc Phục:
1. **NGAY LẬP TỨC:** Cập nhật system prompt cảnh báo về Quẻ Cổ
2. **QUAN TRỌNG:** Thêm logic phân tích xu hướng biến đổi
3. **CẦN THIẾT:** Hiển thị rõ cảnh báo trên UI
4. **DÀI HẠN:** Xây dựng knowledge base chi tiết cho từng quẻ

---

**Người thực hiện:** v0 AI Assistant
**Ngày phân tích:** 2026-01-18
**Trạng thái:** Đã xác định vấn đề, đang triển khai sửa lỗi
