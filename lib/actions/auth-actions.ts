"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error("[v0] Sign up error:", error)
    return { error: error.message }
  }

  // Update user profile in users table
  if (data.user && fullName) {
    await supabase.from("users").update({ full_name: fullName }).eq("id", data.user.id)
  }

  revalidatePath("/")
  return { user: data.user }
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("[v0] Sign in error:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  return { user: data.user }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("[v0] Sign out error:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null }
  }

  // Fetch additional user data including is_admin from public.users table
  const { data: userData } = await supabase
    .from("users")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single()

  return {
    user: {
      ...user,
      is_admin: userData?.is_admin || false,
      full_name: userData?.full_name,
    },
  }
}
