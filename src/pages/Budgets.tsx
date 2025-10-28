import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

const budgets = [
  { id: 1, name: "Monthly Budget", total: 3000, spent: 2543.5, category: "Overall" },
  { id: 2, name: "Food Budget", total: 500, spent: 450.5, category: "Food" },
  { id: 3, name: "Transport Budget", total: 300, spent: 200.0, category: "Transport" },
  { id: 4, name: "Entertainment Budget", total: 200, spent: 150.0, category: "Entertainment" },
]

export default function Budgets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budgets</h1>
        <p className="text-muted-foreground">Track your spending against budgets</p>
      </div>

      <div className="grid gap-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.total) * 100
          const remaining = budget.total - budget.spent
          const status = percentage > 90 ? "danger" : percentage > 70 ? "warning" : "success"

          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                    <CardDescription>{budget.category}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${remaining.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Spent: ${budget.spent.toFixed(2)}</span>
                    <span className="text-sm font-medium">${budget.total.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{Math.round(percentage)}% used</span>
                  <span
                    className={`font-semibold ${
                      status === "danger"
                        ? "text-destructive"
                        : status === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {status === "danger" ? "Over budget!" : status === "warning" ? "Caution" : "On track"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
