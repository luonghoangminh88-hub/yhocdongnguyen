export type User = {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export type Consultation = {
  id: string
  user_id: string
  name: string
  birth_date: string
  birth_time?: string
  gender: "male" | "female" | "other"
  question?: string
  hexagram_primary: string
  hexagram_mutual?: string
  hexagram_change?: string
  interpretation?: string
  created_at: string
}

export type Solution = {
  id: string
  hexagram: string
  solution_type: "acupoint" | "herbal" | "numerology"
  title: string
  description: string
  details: any // JSONB field
  is_premium: boolean
  price?: number
  hexagram_analysis?: string // Phân tích chi tiết từ quẻ đến bài thuốc
  created_at: string
}

export type UserAccess = {
  id: string
  user_id: string
  solution_id: string
  access_granted_at: string
  payment_id?: string
  expires_at?: string
}
