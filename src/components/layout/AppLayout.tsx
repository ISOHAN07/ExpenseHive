"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import api from "../../api/apiClient"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    const wakeServer = async () => {
      try {
        await api.get("/ping");
        console.log("✅ Backend is awake!");
      } catch (err) {
        console.warn("⚠️ Failed to ping backend:", err);
      }
    };
    wakeServer();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
