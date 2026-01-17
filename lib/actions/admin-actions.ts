"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function checkAdminAccess() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập", isAdmin: false }
  }

  // Check if user has admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("email", user.email)
    .single()

  if (userError || !userData?.is_admin) {
    return { error: "Bạn không có quyền truy cập trang quản trị", isAdmin: false }
  }

  return { isAdmin: true, user }
}

/**
 * Update pricing for all solutions of a specific type
 */
export async function updateSolutionPricing(
  solutionType: "acupoint" | "prescription" | "symbol_number",
  newPrice: number,
) {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await getSupabaseServerClient()

  // Update all solutions of this type
  const { error } = await supabase.from("solutions").update({ unlock_cost: newPrice }).eq("solution_type", solutionType)

  if (error) {
    console.error("[v0] Error updating solution pricing:", error)
    return { error: "Không thể cập nhật giá" }
  }

  revalidatePath("/admin/payments")
  return { success: true }
}

/**
 * Update payment method configuration
 */
export async function updatePaymentMethod(
  methodId: string,
  data: {
    account_number?: string
    account_name?: string
    is_active?: boolean
  },
) {
  const adminCheck = await checkAdminAccess()
  if (!adminCheck.isAdmin) {
    return { error: adminCheck.error }
  }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("payment_methods").update(data).eq("id", methodId)

  if (error) {
    console.error("[v0] Error updating payment method:", error)
    return { error: "Không thể cập nhật phương thức thanh toán" }
  }

  revalidatePath("/admin/payments")
  return { success: true }
}
