"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { createClient } from "@/lib/supabase/client"
import { ShoppingBag, Calendar, Check, Eye, ArrowRight } from "lucide-react"
import { getTrigramByName } from "@/lib/data/trigram-data"

interface Purchase {
  id: string
  solution_id: string
  granted_at: string
  solutions: {
    title: string
    solution_type: string
    unlock_cost: number
    hexagram_key: string
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
      
      // If admin, load ALL solutions from database
      if (user.is_admin) {
        const { data: allSolutions, error: solutionsError } = await supabase
          .from("solutions")
          .select("id, title, solution_type, unlock_cost, hexagram_key")
          .order("created_at", { ascending: false })

        if (!solutionsError && allSolutions) {
          // Format to match Purchase interface
          const formattedPurchases = allSolutions.map((solution) => ({
            id: `admin-${solution.id}`,
            solution_id: solution.id,
            granted_at: new Date().toISOString(), // Use current time for admin
            solutions: solution,
          }))
          setPurchases(formattedPurchases as any)
        }
        setIsLoading(false)
        return
      }

      // For regular users, load their user_access records
      const { data, error } = await supabase
        .from("user_access")
        .select(`
          id,
          solution_id,
          granted_at,
          solutions (
            title,
            solution_type,
            unlock_cost,
            hexagram_key
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
    if (solutionType === "acupoint") return "Gói Khai Huyệt"
    if (solutionType === "prescription") return "Gói Nam Dược"
    if (solutionType === "symbol_number") return "Gói Tượng Số"
    return solutionType
  }

  const getPackageRoute = (solutionType: string) => {
    if (solutionType === "acupoint") return "/treatment/acupressure"
    if (solutionType === "prescription") return "/treatment/herbal"
    if (solutionType === "symbol_number") return "/treatment/numerology"
    return "/"
  }

  const navigateToSolution = (purchase: Purchase) => {
    try {
      const hexagramKey = purchase.solutions.hexagram_key
      
      // Parse hexagram_key - can be "Càn Càn" or "upper_lower_moving" format
      let upperTrigram, lowerTrigram, movingLine = 1
      
      if (hexagramKey.includes("_")) {
        // Format: "6_3_2" (upper_lower_moving)
        const [upper, lower, moving] = hexagramKey.split("_")
        upperTrigram = { number: parseInt(upper) }
        lowerTrigram = { number: parseInt(lower) }
        movingLine = parseInt(moving) || 1
      } else {
        // Format: "Càn Càn" (Vietnamese names)
        const [upperName, lowerName] = hexagramKey.split(" ")
        upperTrigram = getTrigramByName(upperName)
        lowerTrigram = getTrigramByName(lowerName)
      }
      
      if (!upperTrigram || !lowerTrigram) {
        console.error("[v0] Invalid hexagram:", hexagramKey)
        return
      }
      
      const route = getPackageRoute(purchase.solutions.solution_type)
      const url = `${route}?upper=${upperTrigram.number}&lower=${lowerTrigram.number}&moving=${movingLine}`
      
      window.location.href = url
    } catch (error) {
      console.error("[v0] Error navigating to solution:", error)
    }
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

      {user?.is_admin && (
        <Card className="border-primary/50 bg-primary/5 mb-6">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-bold">Tài khoản Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Quyền truy cập không giới hạn tất cả {purchases.length} gói
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-sm">
              Admin Access
            </Badge>
          </CardContent>
        </Card>
      )}

      {!user?.is_admin && purchases.length === 0 ? (
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
            <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      {getPackageName(purchase.solutions.solution_type)}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {purchase.solutions.title}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {purchase.solutions.unlock_cost.toLocaleString("vi-VN")}đ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {user?.is_admin ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Truy cập trọn đời</span>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  <Button 
                    onClick={() => navigateToSolution(purchase)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
