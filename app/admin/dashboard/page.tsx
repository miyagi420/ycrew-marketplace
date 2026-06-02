import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, Shield, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Platform overview and moderation tools</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-slate-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-slate-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Shield className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-slate-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€24,580</div>
            <p className="text-xs text-slate-600 mt-1">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>Review and approve user verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Mitchell", type: "STCW Certificate", status: "pending", date: "2 hours ago" },
                  { name: "James Rodriguez", type: "ENG1 Medical", status: "pending", date: "5 hours ago" },
                  { name: "Emma Thompson", type: "Chief Engineer CoC", status: "pending", date: "1 day ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-slate-600">
                          {item.type} • {item.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abuse Reports</CardTitle>
              <CardDescription>Review and moderate reported content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { reporter: "Anonymous", subject: "Job Post #1234", reason: "Suspicious pay rate", status: "open" },
                  {
                    reporter: "John Doe",
                    subject: "User: fake_captain",
                    reason: "Fake credentials",
                    status: "investigating",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">{item.subject}</p>
                        <p className="text-sm text-slate-600">
                          {item.reason} • Reported by {item.reporter}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === "open" ? "destructive" : "secondary"}>{item.status}</Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <Button>Search</Button>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      name: "Captain John Smith",
                      email: "john@example.com",
                      role: "CREW",
                      status: "active",
                      plan: "Pro",
                    },
                    {
                      name: "Luxury Yachts Ltd",
                      email: "contact@luxury.com",
                      role: "OWNER",
                      status: "active",
                      plan: "Enterprise",
                    },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge>{user.plan}</Badge>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Time to Match</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-slate-600">Median</p>
                      <p className="text-2xl font-bold">3.2 days</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-slate-600">P90</p>
                      <p className="text-2xl font-bold">6.8 days</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-slate-600">Target</p>
                      <p className="text-2xl font-bold text-green-600">≤ 7 days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Conversion Rates</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Completion Rate</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Application to Interview</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Interview to Hire</span>
                      <span className="font-medium">42%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
