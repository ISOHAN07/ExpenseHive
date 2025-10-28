"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Bell, Lock, Eye, DollarSign, Download, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    budgetAlerts: true,
    weeklyReport: true,
    twoFactorAuth: false,
    currency: "USD",
    theme: "system",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your preferences and account settings</p>
        </div>

        {/* Notifications */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <button
                onClick={() => handleToggle("pushNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">Alert when approaching budget limits</p>
              </div>
              <button
                onClick={() => handleToggle("budgetAlerts")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.budgetAlerts ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.budgetAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Receive weekly spending reports</p>
              </div>
              <button
                onClick={() => handleToggle("weeklyReport")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReport ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyReport ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => handleToggle("twoFactorAuth")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Preferences</CardTitle>
            </div>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSelectChange("currency", e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSelectChange("theme", e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or delete your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary hover:bg-primary/90">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
