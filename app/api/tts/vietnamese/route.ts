import { NextRequest, NextResponse } from "next/server"

// Declare global __api_key provided by v0 runtime
declare global {
  var __api_key: string | undefined
}

// Gemini TTS endpoint
const GEMINI_TTS_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-tts:generateContent"

// Exponential backoff retry mechanism
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // Success
      if (response.ok) return response

      // Retry on 429 (rate limit) or 5xx errors
      if (response.status === 429 || response.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s, 8s, 16s
        console.log(`[v0] TTS API retry attempt ${attempt + 1}, waiting ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // Other errors, don't retry
      throw new Error(`TTS API error: ${response.status} ${response.statusText}`)
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      const delay = Math.pow(2, attempt) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error("Max retries exceeded")
}

export async function POST(request: NextRequest) {
  try {
    const { numbers } = await request.json()

    if (!numbers || !Array.isArray(numbers)) {
      return NextResponse.json({ error: "Invalid numbers array" }, { status: 400 })
    }

    // Convert numbers to Vietnamese words
    const numberMap: Record<string, string> = {
      "0": "Không",
      "1": "Một",
      "2": "Hai",
      "3": "Ba",
      "4": "Bốn",
      "5": "Năm",
      "6": "Sáu",
      "7": "Bảy",
      "8": "Tám",
      "9": "Chín",
    }

    const vietnameseNumbers = numbers.map((num) => numberMap[num] || num)

    // Format text for calm meditation reading with pauses
    const textToRead = `Cách niệm đúng là: ${vietnameseNumbers.join(". ")}. Đọc chậm rãi theo hơi thở.`

    console.log("[v0] Generating TTS for:", textToRead)

    // Prepare Gemini TTS request
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Say calmly and slowly in Vietnamese: ${textToRead}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede", // Female voice, calm tone
            },
          },
        },
      },
    }

    // Get API key from global variable (provided by v0 runtime) or environment
    const apiKey = typeof __api_key !== 'undefined' ? __api_key : (process.env.AI_GATEWAY_API_KEY || process.env.GOOGLE_API_KEY || "")

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. System will provide API key automatically." },
        { status: 500 }
      )
    }

    // Call Gemini TTS API with retry
    const response = await fetchWithRetry(`${GEMINI_TTS_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    // Extract audio data
    const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData

    if (!audioData || !audioData.data) {
      console.error("[v0] No audio data received:", data)
      return NextResponse.json({ error: "No audio data received from TTS API" }, { status: 500 })
    }

    // Return base64 audio data and mime type
    return NextResponse.json({
      audioData: audioData.data,
      mimeType: audioData.mimeType || "audio/pcm",
      success: true,
    })
  } catch (error) {
    console.error("[v0] TTS API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
