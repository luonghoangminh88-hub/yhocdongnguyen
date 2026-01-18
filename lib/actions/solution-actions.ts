"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getSolutionsByHexagram(hexagram: string) {
  const supabase = await getSupabaseServerClient()

  const { data: solutions, error } = await supabase
    .from("solutions")
    .select("*")
    .eq("hexagram_key", hexagram)
    .order("solution_type")

  if (error) {
    console.error("[v0] Error fetching solutions:", error)
    return { error: "Không thể tải giải pháp" }
  }

  return { solutions }
}

export async function getSolutionsByHexagramKey(hexagramKey: string) {
  const supabase = await getSupabaseServerClient()

  const { data: solutions, error } = await supabase
    .from("solutions")
    .select("*")
    .eq("hexagram_key", hexagramKey)
    .order("solution_type")

  if (error) {
    console.error("[v0] Error fetching solutions by key:", error)
    return { error: "Không thể tải giải pháp" }
  }

  return { solutions }
}

export async function checkUserAccess(solutionId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { hasAccess: false }
  }

  // Check if user is admin - admins have access to everything
  const { data: userData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (userData?.is_admin) {
    console.log("[v0] Admin user detected - granting full access")
    return { hasAccess: true, access: { is_admin: true } }
  }

  // Check if user has access to this solution
  const { data: access, error } = await supabase
    .from("user_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("solution_id", solutionId)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error checking access:", error)
    return { hasAccess: false }
  }

  // Check if access has expired
  if (access && access.expires_at) {
    const now = new Date()
    const expiresAt = new Date(access.expires_at)
    if (now > expiresAt) {
      return { hasAccess: false, expired: true }
    }
  }

  return { hasAccess: !!access, access }
}

export async function getUserAccessibleSolutions() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Người dùng chưa đăng nhập" }
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  // If admin, return all solutions (no need for user_access check)
  if (userData?.is_admin) {
    const { data: allSolutions, error: solutionsError } = await supabase
      .from("solutions")
      .select("*")
      .order("created_at", { ascending: false })

    if (solutionsError) {
      console.error("[v0] Error fetching all solutions for admin:", solutionsError)
      return { error: "Không thể tải danh sách giải pháp" }
    }

    // Format to match the accessRecords structure
    const accessRecords = allSolutions?.map((solution) => ({
      id: `admin-${solution.id}`,
      user_id: user.id,
      solution_id: solution.id,
      granted_at: new Date().toISOString(),
      expires_at: null,
      solutions: solution,
    }))

    return { accessRecords }
  }

  // Get all solutions the user has access to
  const { data: accessRecords, error } = await supabase
    .from("user_access")
    .select(
      `
      *,
      solutions (*)
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching accessible solutions:", error)
    return { error: "Không thể tải danh sách giải pháp" }
  }

  return { accessRecords }
}
