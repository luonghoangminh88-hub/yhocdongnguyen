import { NextResponse } from "next/server"
import { createTimoDeposit } from "@/lib/actions/timo-payment-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { solution_id, amount, package_type, hexagram_key } = body

    console.log("[v0] Deposit create request:", { solution_id, amount, package_type, hexagram_key })

    // Amount is always required
    if (!amount) {
      return NextResponse.json({ error: "Missing required field: amount" }, { status: 400 })
    }

    // solution_id is optional (null for acupoint/numerology packages)
    // For prescription packages, solution_id is required
    if (package_type === "prescription" && !solution_id) {
      return NextResponse.json({ error: "Missing required field: solution_id for prescription package" }, { status: 400 })
    }

    const result = await createTimoDeposit({
      solutionId: solution_id || null,
      amount: Number.parseInt(amount),
      packageType: package_type,
      hexagramKey: hexagram_key,
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
