import { NextResponse } from "next/server"
import { checkDepositStatus } from "@/lib/actions/timo-payment-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { deposit_id } = body

    if (!deposit_id) {
      return NextResponse.json({ error: "Missing deposit_id" }, { status: 400 })
    }

    const result = await checkDepositStatus(deposit_id)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      deposit: result.deposit,
    })
  } catch (error) {
    console.error("[v0] Error in /api/deposits/check:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
