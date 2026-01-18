"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { createClient } from "@/lib/supabase/client"
import { ShoppingBag, Calendar, Check } from "lucide-react"

interface Purchase {
  id: string
  solution_id: string
  granted_at: string
  solutions: {
    title: string
    solution_type: string
    unlock_cost: number
  }
}

export default function PurchasesPage() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { user } = await getCurrentUser()
      if (!user) {
        redirect("/auth/login")
      }
      setUser(user)

      const supabase = createClient()
      const { data, error } = await supabase
        .from("user_access")
        .select(`
          id,
          solution_id,
          granted_at,
          solutions (
            title,
            solution_type,
            unlock_cost
          )
        `)
        .eq("user_id", user.id)
        .order("granted_at", { ascending: false })

      if (!error && data) {
        setPurchases(data as any)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const getPackageName = (solutionType: string) => {
    if (solutionType === "acupressure") return "Gói Khai Huyệt"
    if (solutionType === "prescription") return "Gói Nam Dược"
    if (solutionType === "numerology") return "Gói Tượng Số"
    return solutionType
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-secondary animate-pulse rounded"></div>
          <div className="h-32 bg-secondary animate-pulse rounded"></div>
          <div className="h-32 bg-secondary animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gói đã mua</h1>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              Bạn chưa mua gói nào
            </p>
            <Button onClick={() => window.location.href = "/services"}>
              Xem các gói dịch vụ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      {getPackageName(purchase.solutions.solution_type)}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {purchase.solutions.title}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {purchase.solutions.unlock_cost.toLocaleString("vi-VN")}đ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Đã mua: {new Date(purchase.granted_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
