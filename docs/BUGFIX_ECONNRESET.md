# Sửa lỗi ECONNRESET - Connection Reset

## Vấn đề
Lỗi `ECONNRESET` (Error: aborted) xảy ra nhiều lần, gây crash ứng dụng:
\`\`\`
Error: aborted
    at ignore-listed frames {
  code: 'ECONNRESET'
}
 ⨯ uncaughtException: Error: aborted
\`\`\`

## Nguyên nhân
1. **Không có timeout cho OpenAI API calls** - Request có thể treo vô thời hạn
2. **Thiếu error handling cho network errors** - Kết nối bị đóng đột ngột không được xử lý
3. **Không có AbortController** - Không thể hủy request khi timeout
4. **Client timeout quá dài** - Không có giới hạn thời gian phía client

## Giải pháp đã triển khai

### 1. Server-side (API Route)
**File**: `/app/api/diagnose-ai/route.ts`

#### Thêm timeout cho OpenAI fetch:
\`\`\`typescript
async function generateTextWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 seconds timeout

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      // ... other options
      signal: controller.signal, // ✅ Thêm abort signal
    })

    clearTimeout(timeoutId)
    // ... xử lý response
    
  } catch (error) {
    clearTimeout(timeoutId) // ✅ Cleanup timeout
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("AI request timed out")
    }
    throw error
  }
}
\`\`\`

#### Cải thiện error handling trong POST handler:
\`\`\`typescript
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // ... logic chính
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[v0] API error after ${duration}ms:`, error)
    
    // ✅ Xử lý cụ thể cho connection errors
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        return NextResponse.json(
          {
            error: "Kết nối AI bị gián đoạn",
            details: "Vui lòng thử lại hoặc tắt chế độ AI",
            status: "connection_error",
            fallback: true,
          },
          { status: 503 },
        )
      }
    }
    
    // ... xử lý lỗi chung
  }
}
\`\`\`

### 2. Client-side
**File**: `/lib/ai/diagnosis-with-ai.ts`

#### Thêm client timeout:
\`\`\`typescript
export async function diagnoseWithAI(params, retryCount = 0): Promise<AIDiagnosisResult> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // ✅ 25s client timeout
  
  try {
    const response = await fetch("/api/diagnose-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal, // ✅ Thêm abort signal
    })

    clearTimeout(timeoutId)
    
    // ✅ Xử lý response code 503 (service unavailable)
    if (response.status === 503) {
      const data = await response.json()
      throw new Error(data.details || "Service temporarily unavailable")
    }

    // ... xử lý các case khác
    
  } catch (error) {
    clearTimeout(timeoutId) // ✅ Cleanup
    
    // Return graceful fallback thay vì crash
    return {
      rawCalculation: performComprehensiveDiagnosis(params),
      aiInterpretation: {
        // ... fallback content
      },
      usedAI: false,
      generatedAt: new Date().toISOString(),
    }
  }
}
\`\`\`

## Kết quả

### Trước khi sửa:
- ❌ Request treo vô thời hạn
- ❌ ECONNRESET gây crash toàn bộ ứng dụng
- ❌ Không có fallback khi AI fail
- ❌ User không biết chuyện gì đang xảy ra

### Sau khi sửa:
- ✅ Request tự động timeout sau 15s (server) và 25s (client)
- ✅ Lỗi được bắt và xử lý gracefully
- ✅ Tự động fallback về phân tích cơ bản
- ✅ User nhận được thông báo rõ ràng
- ✅ Ứng dụng không crash

## Timeout Strategy

\`\`\`
Client (25s) > Server Total (20s) > OpenAI API (15s)
\`\`\`

1. **OpenAI API timeout: 15s** - Đủ thời gian cho AI response nhưng không quá lâu
2. **Server processing: +5s buffer** - Cho cache lookup, pre/post processing
3. **Client timeout: 25s** - Cao hơn server để không timeout sớm hơn

## Testing

Để test timeout handling:
1. Tắt internet sau khi submit form
2. Block OpenAI API domain
3. Set timeout ngắn hơn (5s) để test

## Monitoring

Thêm logging để theo dõi:
\`\`\`typescript
console.log(`[v0] AI generation completed in ${endTime - startTime}ms`)
console.log(`[v0] Diagnosis request from IP: ${ip}`)
console.error(`[v0] API error after ${duration}ms:`, error)
\`\`\`

## Lưu ý quan trọng

1. **Không bỏ clearTimeout** - Có thể gây memory leak
2. **Luôn có fallback** - Đảm bảo user vẫn có kết quả
3. **Log errors** - Để debug và monitoring
4. **Test thoroughly** - Với nhiều network conditions khác nhau

## Các file đã sửa
- `/app/api/diagnose-ai/route.ts` - Server-side timeout và error handling
- `/lib/ai/diagnosis-with-ai.ts` - Client-side timeout và fallback
