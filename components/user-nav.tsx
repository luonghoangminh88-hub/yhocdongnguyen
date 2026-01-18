"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, ShoppingBag, Menu, BookOpen, Shield } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/actions/auth-actions"
import { QuickAuthModal } from "@/components/quick-auth-modal"

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; full_name?: string; is_admin?: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const handleAuthSuccess = async () => {
    const { user } = await getCurrentUser()
    setUser(user)
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
            Đăng nhập
          </Button>
          <Button size="sm" onClick={() => setAuthModalOpen(true)}>
            Đăng ký
          </Button>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/learn")}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Tìm hiểu</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAuthModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Đăng nhập</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAuthModalOpen(true)}>
                <span className="ml-6">Đăng ký</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <QuickAuthModal
          open={authModalOpen}
          onOpenChange={(open) => {
            setAuthModalOpen(open)
            if (!open) {
              handleAuthSuccess()
            }
          }}
        />
      </>
    )
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name || "Người dùng"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/learn")} className="md:hidden">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Tìm hiểu</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Trang cá nhân</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile/purchases")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Gói đã mua</span>
        </DropdownMenuItem>
        {user.is_admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/payments")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Quản trị</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
