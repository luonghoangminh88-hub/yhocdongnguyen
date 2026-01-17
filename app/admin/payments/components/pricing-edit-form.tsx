"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSolutionPricing } from "@/lib/actions/admin-actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PricingEditFormProps {
  solutionType: "acupoint" | "prescription" | "symbol_number"
  currentPrice: number
}

export function PricingEditForm({ solutionType, currentPrice }: PricingEditFormProps) {
  const [price, setPrice] = useState(currentPrice.toString())
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newPrice = Number.parseInt(price)

    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("Giá không hợp lệ")
      setLoading(false)
      return
    }

    const result = await updateSolutionPricing(solutionType, newPrice)

    if (result.success) {
      toast.success("Cập nhật giá thành công")
      router.refresh()
    } else {
      toast.error(result.error || "Có lỗi xảy ra")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={`price-${solutionType}`}>Giá mới (VND)</Label>
        <Input
          id={`price-${solutionType}`}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="199000"
          min="0"
          step="1000"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Cập nhật giá
      </Button>
    </form>
  )
}
