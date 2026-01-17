import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingEditForm } from "./pricing-edit-form"

export async function PricingManager() {
  const supabase = await getSupabaseServerClient()

  // Get current pricing for each solution type
  const { data: pricingData } = await supabase
    .from("solutions")
    .select("solution_type, unlock_cost")
    .in("solution_type", ["acupoint", "prescription", "symbol_number"])
    .limit(3)

  const pricing = {
    acupoint: pricingData?.find((p) => p.solution_type === "acupoint")?.unlock_cost || 299000,
    prescription: pricingData?.find((p) => p.solution_type === "prescription")?.unlock_cost || 199000,
    symbol_number: pricingData?.find((p) => p.solution_type === "symbol_number")?.unlock_cost || 99000,
  }

  const packages = [
    {
      id: 1,
      name: "Gói Khai Huyệt",
      description: "Bản đồ huyệt đạo chi tiết",
      solution_type: "acupoint" as const,
      current_price: pricing.acupoint,
      icon: "🎯",
    },
    {
      id: 2,
      name: "Gói Nam Dược",
      description: "Bài thuốc thảo dược Nam Dược Thần Hiệu",
      solution_type: "prescription" as const,
      current_price: pricing.prescription,
      icon: "🌿",
    },
    {
      id: 3,
      name: "Gói Tượng Số",
      description: "Tượng số theo Mai Hoa Kinh Dịch",
      solution_type: "symbol_number" as const,
      current_price: pricing.symbol_number,
      icon: "🔢",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pkg.icon}</span>
              <div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Giá hiện tại</p>
                <p className="text-2xl font-bold">{pkg.current_price.toLocaleString("vi-VN")}đ</p>
              </div>

              <PricingEditForm solutionType={pkg.solution_type} currentPrice={pkg.current_price} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
