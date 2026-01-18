# Tính Năng Truy Cập Chi Tiết Gói Đã Mua

## Vấn Đề Trước Đây

User mua gói dịch vụ nhưng không biết cách truy cập vào chi tiết:
- Trang `/profile/purchases` chỉ hiển thị danh sách các gói đã mua
- Không có nút hoặc link để xem chi tiết bài thuốc, huyệt đạo, hay giải mã số
- User bị "mắc kẹt" sau khi thanh toán, không biết làm gì tiếp

## Giải Pháp Đã Triển Khai

### 1. **Cập Nhật Database Query**
Lấy thêm thông tin cần thiết từ bảng `solutions`:
\`\`\`typescript
solutions (
  title,
  solution_type,
  unlock_cost,
  hexagram_key,      // ← MỚI: để biết quẻ nào
  moving_line        // ← MỚI: để biết động hào
)
\`\`\`

### 2. **Thêm Helper Functions**

#### `getTrigramByName()` trong `/lib/data/trigram-data.ts`
\`\`\`typescript
export function getTrigramByName(vietnameseName: string): TrigramData | null {
  const trigramKey = Object.keys(TRIGRAMS).find(
    (key) => TRIGRAMS[key].vietnamese === vietnameseName
  )
  return trigramKey ? TRIGRAMS[trigramKey] : null
}
\`\`\`

#### `navigateToSolution()` trong purchases page
Chuyển đổi từ hexagram_key sang URL:
- Parse `hexagram_key` (VD: "Càn Càn", "Sơn Trạch")
- Lấy số trigram từ tên tiếng Việt
- Tạo URL với query params: `?upper=1&lower=1&moving=1`
- Điều hướng đến trang treatment phù hợp

### 3. **Cải Thiện UI**

**Trước:**
\`\`\`
[Gói Nam Dược]
Bài thuốc Sơn Trạch Tổn
Đã mua: 17/1/2026
\`\`\`

**Sau:**
\`\`\`
[Gói Nam Dược]
Bài thuốc Sơn Trạch Tổn
Đã mua: 17/1/2026        [👁️ Xem chi tiết →]
\`\`\`

### 4. **Luồng Hoạt Động**

\`\`\`
User vào /profile/purchases
    ↓
Thấy danh sách gói đã mua
    ↓
Click "Xem chi tiết"
    ↓
navigateToSolution() parse hexagram_key
    ↓
Điều hướng đến:
  - /treatment/acupressure?upper=X&lower=Y&moving=Z
  - /treatment/herbal?upper=X&lower=Y&moving=Z
  - /treatment/numerology?upper=X&lower=Y&moving=Z
    ↓
GatedContentWrapper check quyền truy cập
    ↓
✅ Hiển thị đầy đủ chi tiết gói
\`\`\`

## Các Route Mapping

| Solution Type | Package Name | Route |
|--------------|-------------|-------|
| `acupoint` | Gói Khai Huyệt | `/treatment/acupressure` |
| `prescription` | Gói Nam Dược | `/treatment/herbal` |
| `symbol_number` | Gói Tượng Số | `/treatment/numerology` |

## Chi Tiết Hiển Thị Theo Gói

### Gói 1: Khai Huyệt (`/treatment/acupressure`)
- Danh sách huyệt đạo cần bấm
- Vị trí huyệt (với hình minh họa)
- Cách bấm, thời gian, lực độ
- Lưu ý khi bấm
- Cơ chế hoạt động theo Ngũ Hành

### Gói 2: Nam Dược (`/treatment/herbal`)
- **Tab Vị thuốc**: Danh sách 8-12 vị thuốc với:
  - Tên thuốc
  - Vai trò (Quân/Thần/Tá/Sứ)
  - Liều lượng
  - Vị, tính, hành, kinh
  - Công dụng chi tiết
- **Tab Cách sắc**: Hướng dẫn từng bước
- **Tab Liều dùng**: Thời gian và cách uống
- **Tab Lưu ý**: Chống chỉ định, tương tác

### Gói 3: Tượng Số (`/treatment/numerology`)
- Giải mã ý nghĩa số học
- Con số tương ứng với cơ quan
- Lời khuyên điều hòa
- Phương pháp sử dụng số

## Testing Checklist

- [ ] User có thể thấy nút "Xem chi tiết" trên mỗi gói đã mua
- [ ] Click vào nút điều hướng đúng trang treatment
- [ ] URL chứa đúng query params (upper, lower, moving)
- [ ] Trang treatment hiển thị đúng nội dung cho hexagram
- [ ] GatedContentWrapper không yêu cầu thanh toán lại
- [ ] Admin có thể truy cập tất cả gói mà không cần mua
- [ ] Không có lỗi console khi navigate

## Lưu Ý Quan Trọng

1. **Hexagram Key Format**: Phải đúng format "Tên1 Tên2" (VD: "Càn Càn", "Sơn Trạch")
2. **Solution Type**: Phải khớp chính xác: `acupoint`, `prescription`, `symbol_number`
3. **Moving Line**: Default là 1 nếu không có trong database
4. **Admin Access**: Admin vẫn thấy thông báo đặc biệt thay vì danh sách trống

## Files Đã Thay Đổi

1. `/app/profile/purchases/page.tsx` - Thêm nút và navigation logic
2. `/lib/data/trigram-data.ts` - Thêm `getTrigramByName()`
3. `/lib/actions/solution-actions.ts` - Đã có admin bypass logic

## Next Steps

- [ ] Thêm breadcrumb để user dễ quay lại trang purchases
- [ ] Thêm nút "Tải PDF" để user lưu bài thuốc
- [ ] Thêm reminder notification sau 7 ngày mua để nhắc user sử dụng
- [ ] Track usage analytics: bao nhiêu % user thực sự xem chi tiết sau khi mua
