"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createTimoDepositData, validateTimoAmount, type TimoDeposit, type TimoPaymentMethod } from "@/lib/timo-payment"

/**
 * Get active Timo payment method
 */
export async function getTimoPaymentMethod() {
  const supabase = await getSupabaseServerClient()

  const { data: paymentMethod, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("bank_code", "VCCB")
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching Timo payment method:", error)
    return { error: "Không tìm thấy phương thức thanh toán Timo" }
  }

  return { paymentMethod: paymentMethod as TimoPaymentMethod }
}

/**
 * Create a new deposit for Timo payment
 */
export async function createTimoDeposit(params: { solutionId: string; amount: number }) {
  const supabase = await getSupabaseServerClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  // Get Timo payment method
  const { paymentMethod, error: methodError } = await getTimoPaymentMethod()

  if (methodError || !paymentMethod) {
    return { error: methodError || "Không tìm thấy phương thức thanh toán" }
  }

  const validation = validateTimoAmount(params.amount)

  if (!validation.valid) {
    return { error: validation.error }
  }

  // Check if solution exists and verify price matches
  const { data: solution, error: solutionError } = await supabase
    .from("solutions")
    .select("*")
    .eq("id", params.solutionId)
    .single()

  if (solutionError || !solution) {
    return { error: "Không tìm thấy giải pháp" }
  }

  if (solution.unlock_cost !== params.amount) {
    return { error: `Giá gói này là ${solution.unlock_cost.toLocaleString("vi-VN")}đ` }
  }

  // Create deposit data
  const depositData = createTimoDepositData({
    userId: user.id,
    paymentMethodId: paymentMethod.id,
    amount: params.amount,
    accountNumber: paymentMethod.account_number,
    accountName: paymentMethod.account_name,
    feePercentage: paymentMethod.fee_percentage,
    feeFixed: paymentMethod.fee_fixed,
  })

  // Insert deposit record
  const { data: deposit, error: depositError } = await supabase.from("deposits").insert(depositData).select().single()

  if (depositError) {
    console.error("[v0] Error creating deposit:", depositError)
    return { error: "Không thể tạo giao dịch nạp tiền" }
  }

  // Store solution_id in metadata for later access granting
  await supabase
    .from("deposits")
    .update({ payment_data: { ...deposit.payment_data, solution_id: params.solutionId } })
    .eq("id", deposit.id)

  return { deposit: deposit as TimoDeposit, paymentMethod }
}

/**
 * Check deposit status
 */
export async function checkDepositStatus(depositId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  const { data: deposit, error } = await supabase
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return { error: "Không tìm thấy giao dịch" }
  }

  return { deposit: deposit as TimoDeposit }
}

/**
 * Process completed deposit - grant access to solution
 */
export async function processCompletedDeposit(depositId: string) {
  const supabase = await getSupabaseServerClient()

  // Get deposit
  const { data: deposit, error: depositError } = await supabase
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single()

  if (depositError || !deposit) {
    return { error: "Không tìm thấy giao dịch" }
  }

  if (deposit.status !== "completed") {
    return { error: "Giao dịch chưa hoàn thành" }
  }

  // Get solution_id from payment_data
  const solutionId = deposit.payment_data?.solution_id

  if (!solutionId) {
    return { error: "Không tìm thấy solution_id" }
  }

  // Grant access to solution
  const { data: access, error: accessError } = await supabase
    .from("user_access")
    .insert({
      user_id: deposit.user_id,
      solution_id: solutionId,
      payment_id: deposit.payment_code,
      expires_at: null, // Lifetime access
    })
    .select()
    .single()

  if (accessError) {
    // Check if already exists
    if (accessError.code === "23505") {
      return { success: true, message: "Người dùng đã có quyền truy cập" }
    }
    console.error("[v0] Error granting access:", accessError)
    return { error: "Không thể cấp quyền truy cập" }
  }

  revalidatePath("/treatment")
  return { success: true, access }
}

/**
 * Cancel expired deposits (pending > 30 minutes)
 */
export async function cancelExpiredDeposits() {
  const supabase = await getSupabaseServerClient()

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from("deposits")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("status", "pending")
    .lt("created_at", thirtyMinutesAgo)

  if (error) {
    console.error("[v0] Error cancelling expired deposits:", error)
    return { error: "Không thể hủy giao dịch hết hạn" }
  }

  return { success: true }
}
