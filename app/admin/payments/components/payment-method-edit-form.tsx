"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updatePaymentMethod } from "@/lib/actions/admin-actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PaymentMethodEditFormProps {
  method: {
    id: string
    account_number: string
    account_name: string
    is_active: boolean
  }
}

export function PaymentMethodEditForm({ method }: PaymentMethodEditFormProps) {
  const [accountNumber, setAccountNumber] = useState(method.account_number || "")
  const [accountName, setAccountName] = useState(method.account_name || "")
  const [isActive, setIsActive] = useState(method.is_active)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await updatePaymentMethod(method.id, {
      account_number: accountNumber,
      account_name: accountName,
      is_active: isActive,
    })

    if (result.success) {
      toast.success("Cập nhật phương thức thanh toán thành công")
      router.refresh()
    } else {
      toast.error(result.error || "Có lỗi xảy ra")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <div className="space-y-2">
        <Label htmlFor={`account-number-${method.id}`}>Số tài khoản</Label>
        <Input
          id={`account-number-${method.id}`}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="1055116973"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`account-name-${method.id}`}>Tên chủ tài khoản</Label>
        <Input
          id={`account-name-${method.id}`}
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="NGUYEN VAN A"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id={`active-${method.id}`} checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor={`active-${method.id}`}>Đang hoạt động</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Cập nhật
      </Button>
    </form>
  )
}
