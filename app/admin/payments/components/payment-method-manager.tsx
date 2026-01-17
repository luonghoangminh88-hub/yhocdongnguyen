import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentMethodEditForm } from "./payment-method-edit-form"

export async function PaymentMethodManager() {
  const supabase = await getSupabaseServerClient()

  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .order("created_at", { ascending: false })

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chưa có phương thức thanh toán nào</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{method.name}</CardTitle>
                <CardDescription>{method.provider}</CardDescription>
              </div>
              <Badge variant={method.is_active ? "default" : "secondary"}>
                {method.is_active ? "Đang hoạt động" : "Tạm dừng"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Mã ngân hàng</p>
                <p className="font-medium">{method.bank_code || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Loại</p>
                <p className="font-medium">{method.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Số tài khoản</p>
                <p className="font-mono text-xs">{method.account_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tên chủ TK</p>
                <p className="font-medium text-xs">{method.account_name || "N/A"}</p>
              </div>
            </div>

            <PaymentMethodEditForm method={method} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
