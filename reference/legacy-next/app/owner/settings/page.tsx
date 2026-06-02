import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building2, Check } from "lucide-react"

export default function OwnerSettingsPage() {
  const currentPlan = "pro" // This would come from the database

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your subscription and organization settings</p>
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
                {currentPlan === "enterprise" && <Building2 className="h-8 w-8 text-purple-600" />}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg capitalize">{currentPlan} Plan</h3>
                    <Badge variant={currentPlan === "free" ? "secondary" : "default"}>Active</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {currentPlan === "free" && "1 live job at a time"}
                    {currentPlan === "pro" && "Unlimited jobs • €99/month"}
                    {currentPlan === "enterprise" && "Multi-vessel • €299/month"}
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
                        <p className="font-medium">Unlimited Job Posts</p>
                        <p className="text-sm text-slate-600">Post as many positions as you need</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Full Messaging</p>
                        <p className="text-sm text-slate-600">Unlimited conversations with candidates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Contract Templates</p>
                        <p className="text-sm text-slate-600">Professional templates for all roles</p>
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
            <CardDescription>Track your plan usage and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Jobs</span>
                <span className="text-sm text-slate-600">{currentPlan === "free" ? "1 / 1" : "8 / Unlimited"}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Applications Received</span>
                <span className="text-sm text-slate-600">127 this month</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hires Made</span>
                <span className="text-sm text-slate-600">3 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Organization Name</p>
                <p className="text-sm text-slate-600">Luxury Yachts International</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Team Members</p>
                <p className="text-sm text-slate-600">3 members with access</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Billing Information</p>
                <p className="text-sm text-slate-600">Update payment method and invoices</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
