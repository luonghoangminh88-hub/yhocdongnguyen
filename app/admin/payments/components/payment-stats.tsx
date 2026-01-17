import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react"

export async function PaymentStats() {
  const supabase = await getSupabaseServerClient()

  // Get statistics
  const { data: deposits } = await supabase.from("deposits").select("amount, status, created_at")

  const stats = {
    total_revenue: deposits?.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0) || 0,
    pending_count: deposits?.filter((d) => d.status === "pending").length || 0,
    completed_count: deposits?.filter((d) => d.status === "completed").length || 0,
    failed_count: deposits?.filter((d) => d.status === "failed" || d.status === "cancelled").length || 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_revenue.toLocaleString("vi-VN")}đ</div>
          <p className="text-xs text-muted-foreground">Từ {stats.completed_count} giao dịch</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending_count}</div>
          <p className="text-xs text-muted-foreground">Giao dịch chưa xác nhận</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Thành công</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed_count}</div>
          <p className="text-xs text-muted-foreground">Giao dịch hoàn tất</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Thất bại</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.failed_count}</div>
          <p className="text-xs text-muted-foreground">Hủy hoặc lỗi</p>
        </CardContent>
      </Card>
    </div>
  )
}
