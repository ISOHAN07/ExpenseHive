import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const insights = [
  { title: "Average Daily Spending", value: "$84.78", trend: "up", change: "+12%" },
  { title: "Highest Spending Day", value: "Friday", trend: "up", change: "+25%" },
  { title: "Most Spent Category", value: "Entertainment", trend: "down", change: "-8%" },
  { title: "Budget Efficiency", value: "85%", trend: "up", change: "+5%" },
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your spending habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              {insight.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight.value}</div>
              <p className={`text-xs ${insight.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {insight.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Patterns</CardTitle>
          <CardDescription>Key insights about your financial behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">Peak Spending Time</p>
              <p className="text-sm text-muted-foreground">You spend the most on weekends, averaging $120/day</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">Category Trend</p>
              <p className="text-sm text-muted-foreground">Entertainment spending increased by 25% this month</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">Budget Status</p>
              <p className="text-sm text-muted-foreground">You're on track to stay within budget this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
