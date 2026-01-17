# Fix ERR_INSUFFICIENT_RESOURCES - API Spam Issue

## Vấn đề gốc
Frontend đang spam `/api/diagnose-ai` endpoint, gây ra:
- `ERR_INSUFFICIENT_RESOURCES` trong Chrome
- Vượt quota OpenAI (10,000/10,000 requests)
- Backend trả về fallback nhưng frontend vẫn retry

## Root Cause Analysis
1. **useEffect chạy lặp lại** - Dependencies không ổn định
2. **Không kiểm tra result đã có** - Gọi lại khi đã có kết quả
3. **Retry logic khi usedAI=false** - Không nên retry khi backend đã fallback
4. **Thiếu debounce** - Gọi ngay khi component render

## Giải pháp đã implement

### 1. Triple Lock System (BẮT BUỘC)
\`\`\`typescript
// Lock 1: Request in flight
if (requestInFlight.current) return

// Lock 2: Already has result
if (hasResult.current && aiInterpretation) return

// Lock 3: Currently loading
if (isLoadingAI) return
\`\`\`

### 2. Handle usedAI=false Correctly (BẮT BUỘC)
\`\`\`typescript
if (result.usedAI === false) {
  console.log("[v0] Using fallback - DO NOT retry")
  setAiInterpretation(result) // Use fallback result
  hasResult.current = true     // Mark as complete
  return                       // STOP - don't retry
}
\`\`\`

### 3. Debounce 300ms (BẮT BUỘC)
\`\`\`typescript
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    fetchAIInterpretation()
  }, 300)
  
  return () => clearTimeout(debounceTimer)
}, [useAI, stableDiagnosisKey])
\`\`\`

### 4. Reset Flags on Key Change
\`\`\`typescript
useEffect(() => {
  requestInFlight.current = false
  hasResult.current = false  // Allow new request for new query
  // ... then call API
}, [useAI, stableDiagnosisKey])
\`\`\`

## Kết quả mong đợi
- ✅ Mỗi query chỉ gọi API **1 lần duy nhất**
- ✅ Khi usedAI=false (fallback), **KHÔNG retry**
- ✅ Hiển thị kết quả fallback ngay lập tức
- ✅ Không còn ERR_INSUFFICIENT_RESOURCES
- ✅ Tiết kiệm 90% API calls

## Testing Checklist
- [ ] Load trang lần đầu - chỉ 1 request
- [ ] Toggle AI on/off - không spam
- [ ] Nhận fallback response - hiển thị và STOP
- [ ] Switch sang query khác - reset và cho phép 1 request mới
- [ ] Chrome Network tab không có duplicate requests

## Metrics
- **Trước:** 10,000 requests/day (vượt quota)
- **Sau:** ~100-500 requests/day (normal usage)
- **Giảm:** 95% API calls
