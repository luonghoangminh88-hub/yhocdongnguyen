import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

export async function DepositsTable() {
  const supabase = await getSupabaseServerClient()

  const { data: deposits } = await supabase
    .from("deposits")
    .select(
      `
      *,
      users (email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  if (!deposits || deposits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Chưa có giao dịch nào</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
      cancelled: "outline",
    }

    const labels: Record<string, string> = {
      pending: "Chờ",
      processing: "Đang xử lý",
      completed: "Thành công",
      failed: "Thất bại",
      cancelled: "Đã hủy",
    }

    return (
      <Badge variant={variants[status] || "default"} className={status === "completed" ? "bg-green-500" : ""}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Mã thanh toán</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deposits.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell className="font-medium">{deposit.users?.email || "N/A"}</TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">{deposit.payment_code}</code>
              </TableCell>
              <TableCell className="font-semibold">{deposit.amount.toLocaleString("vi-VN")}đ</TableCell>
              <TableCell>{getStatusBadge(deposit.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(deposit.created_at), { addSuffix: true, locale: vi })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
