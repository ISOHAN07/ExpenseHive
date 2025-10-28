"use client"

import type React from "react"

import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
