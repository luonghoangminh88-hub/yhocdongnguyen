import { NextResponse } from "next/server"
import { createTimoDeposit } from "@/lib/actions/timo-payment-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { solution_id, amount } = body

    if (!solution_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await createTimoDeposit({
      solutionId: solution_id,
      amount: Number.parseInt(amount),
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      deposit: result.deposit,
      payment_method: result.paymentMethod,
    })
  } catch (error) {
    console.error("[v0] Error in /api/deposits/create:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
