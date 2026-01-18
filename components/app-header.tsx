"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { Sparkles, BookOpen, Home } from "lucide-react"

interface AppHeaderProps {
  showHomeButton?: boolean
  badges?: {
    primary?: string
    secondary?: string
    primaryClassName?: string
    secondaryClassName?: string
  }
}

function AppHeader({ showHomeButton = false, badges }: AppHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Main header row */}
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="accent-border-left flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
            <h1 className="text-base md:text-xl font-bold">Y Dịch Đồng Nguyên</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
              梅花易数 • Mai Hoa Dịch Số
            </p>
          </div>

          {/* Center: Badges - only show on md+ screens when present */}
          {badges && (
            <div className="hidden md:flex items-center gap-2 mx-4">
              {badges.primary && (
                <Badge
                  className={
                    badges.primaryClassName ||
                    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 text-xs font-semibold whitespace-nowrap"
                  }
                >
                  {badges.primary}
                </Badge>
              )}
              {badges.secondary && (
                <Badge
                  variant="outline"
                  className={
                    badges.secondaryClassName ||
                    "border-emerald-600 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-xs whitespace-nowrap"
                  }
                >
                  {badges.secondary}
                </Badge>
              )}
            </div>
          )}

          {/* Right: Navigation and user menu */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {showHomeButton ? (
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-1 md:gap-2">
                <Home className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push("/services")} className="hidden md:flex">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gói dịch vụ
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push("/learn")} className="hidden md:flex">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tìm hiểu
                </Button>
              </>
            )}
            <UserNav />
          </div>
        </div>

        {/* Mobile badges row - show below main header on small screens */}
        {badges && (
          <div className="flex md:hidden items-center gap-2 pb-2 overflow-x-auto">
            {badges.primary && (
              <Badge
                className={
                  badges.primaryClassName ||
                  "bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                }
              >
                {badges.primary}
              </Badge>
            )}
            {badges.secondary && (
              <Badge
                variant="outline"
                className={
                  badges.secondaryClassName ||
                  "border-emerald-600 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] whitespace-nowrap"
                }
              >
                {badges.secondary}
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader
export { AppHeader }
