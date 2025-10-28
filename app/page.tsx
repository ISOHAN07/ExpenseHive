"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, TrendingUp, PieChart, Zap } from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                EH
              </div>
              <span className="text-xl font-bold text-foreground">ExpenseHive</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Take Control of Your <span className="text-primary">Finances</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Track expenses, manage budgets, and gain insights into your spending habits with ExpenseHive. Smart
            financial management made simple.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to manage your finances</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>Visualize spending patterns with interactive charts</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <PieChart className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set and track budgets across categories</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <Zap className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Quick Tracking</CardTitle>
              <CardDescription>Log expenses in seconds with our intuitive interface</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
