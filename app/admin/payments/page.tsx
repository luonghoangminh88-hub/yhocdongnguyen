import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositsTable } from "./components/deposits-table"
import { PricingManager } from "./components/pricing-manager"
import { PaymentMethodManager } from "./components/payment-method-manager"
import { PaymentStats } from "./components/payment-stats"

export default async function AdminPaymentsPage() {
  const supabase = await getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: userData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()

  if (!userData?.is_admin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Thanh toán</h1>
        <p className="text-muted-foreground mt-2">Xem và quản lý giao dịch, giá bán, phương thức thanh toán</p>
      </div>

      <Suspense fallback={<div>Đang tải thống kê...</div>}>
        <PaymentStats />
      </Suspense>

      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposits">Giao dịch</TabsTrigger>
          <TabsTrigger value="pricing">Giá bán</TabsTrigger>
          <TabsTrigger value="methods">Phương thức TT</TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="space-y-4">
          <Suspense fallback={<div>Đang tải giao dịch...</div>}>
            <DepositsTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="pricing">
          <Suspense fallback={<div>Đang tải giá bán...</div>}>
            <PricingManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="methods">
          <Suspense fallback={<div>Đang tải phương thức thanh toán...</div>}>
            <PaymentMethodManager />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
