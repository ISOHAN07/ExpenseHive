"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8 md:ml-64">
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search expenses..." className="pl-10 bg-muted/50 border-muted" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-border/50">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Premium Member</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
