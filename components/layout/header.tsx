"use client"

import { Button } from "../../components/ui/button"
import { Bell, User, Search } from "lucide-react"
import { Input } from "../../components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search expenses..." className="pl-10 bg-input border-border" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
