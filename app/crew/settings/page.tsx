import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Crown, Check } from "lucide-react"

export default function CrewSettingsPage() {
  const currentPlan = "free" // This would come from the database

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your subscription and account settings</p>
      </div>

      <div className="space-y-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Manage your subscription plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentPlan === "free" && <CreditCard className="h-8 w-8 text-slate-400" />}
                {currentPlan === "pro" && <CreditCard className="h-8 w-8 text-blue-600" />}
                {currentPlan === "elite" && <Crown className="h-8 w-8 text-amber-600" />}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg capitalize">{currentPlan} Plan</h3>
                    <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
                      {currentPlan === "free" ? "Current" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {currentPlan === "free" && "5 applications per month"}
                    {currentPlan === "pro" && "Unlimited applications • €9.99/month"}
                    {currentPlan === "elite" && "All features • €29.99/month"}
                  </p>
                </div>
              </div>
              {currentPlan === "free" && <Button>Upgrade Plan</Button>}
              {currentPlan !== "free" && <Button variant="outline">Manage Billing</Button>}
            </div>

            {currentPlan === "free" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-semibold">Upgrade to unlock:</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Unlimited Applications</p>
                        <p className="text-sm text-slate-600">Apply to as many jobs as you want</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">AI CV Parser</p>
                        <p className="text-sm text-slate-600">Automatically fill your profile from your CV</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Priority in Search</p>
                        <p className="text-sm text-slate-600">Appear higher in owner searches</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your plan usage and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Applications</span>
                <span className="text-sm text-slate-600">{currentPlan === "free" ? "3 / 5" : "47 / Unlimited"}</span>
              </div>
              {currentPlan === "free" && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Views</span>
                <span className="text-sm text-slate-600">142 this month</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Messages Sent</span>
                <span className="text-sm text-slate-600">23 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive updates about new matches and messages</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Privacy Settings</p>
                <p className="text-sm text-slate-600">Control who can see your profile</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-slate-600">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
