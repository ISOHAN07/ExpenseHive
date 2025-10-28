import { Link } from "react-router-dom"
import { BarChart3, Wallet, TrendingUp, Shield } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">ExpenseHive</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Smart Expense Tracking Made Simple
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Take control of your finances with ExpenseHive. Track expenses, manage budgets, and gain insights into your
          spending habits.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose ExpenseHive?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Wallet, title: "Easy Tracking", desc: "Log expenses in seconds" },
            { icon: BarChart3, title: "Smart Reports", desc: "Visualize your spending" },
            { icon: TrendingUp, title: "Budget Goals", desc: "Stay on track with budgets" },
            { icon: Shield, title: "Secure", desc: "Your data is protected" },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-card p-6 rounded-lg border border-border text-center">
                <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
        <p className="mb-8 text-lg opacity-90">Start tracking your expenses today</p>
        <Link to="/signup">
          <Button size="lg" variant="secondary">
            Sign Up Now
          </Button>
        </Link>
      </section>
    </div>
  )
}
