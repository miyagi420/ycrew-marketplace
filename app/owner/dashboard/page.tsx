import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Briefcase, MessageSquare, TrendingUp, Plus, Eye, UserCheck } from "lucide-react"
import Link from "next/link"

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your vessels and crew hiring</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/owner/jobs/new">
                <Plus className="h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Jobs</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>2 positions filled</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className="text-3xl">47</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>+12 this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Shortlisted</CardDescription>
                <CardTitle className="text-3xl">8</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <span>Ready to interview</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Unread Messages</CardDescription>
                <CardTitle className="text-3xl">5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>From 4 candidates</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Active Jobs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Job Postings</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/owner/jobs">View All</Link>
                  </Button>
                </div>
                <CardDescription>Your current open positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Chief Stew",
                      vessel: "M/Y Azure Dream",
                      applications: 18,
                      shortlisted: 3,
                      views: 142,
                      daysActive: 5,
                    },
                    {
                      title: "Deckhand",
                      vessel: "S/Y Ocean Spirit",
                      applications: 24,
                      shortlisted: 4,
                      views: 198,
                      daysActive: 8,
                    },
                    {
                      title: "Engineer",
                      vessel: "M/Y Azure Dream",
                      applications: 5,
                      shortlisted: 1,
                      views: 67,
                      daysActive: 3,
                    },
                  ].map((job, i) => (
                    <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.vessel}</p>
                        </div>
                        <Badge variant="secondary">{job.daysActive}d active</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-2xl font-bold">{job.applications}</p>
                          <p className="text-xs text-muted-foreground">Applications</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{job.shortlisted}</p>
                          <p className="text-xs text-muted-foreground">Shortlisted</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{job.views}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                        <Link href={`/owner/jobs/${i + 1}`}>View Candidates</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Vessels */}
            <div className="space-y-6">
              {/* Vessels */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Vessels</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/owner/vessels">Manage</Link>
                    </Button>
                  </div>
                  <CardDescription>Your registered yachts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "M/Y Azure Dream", type: "60m Motor Yacht", flag: "Malta", openJobs: 2 },
                      { name: "S/Y Ocean Spirit", type: "45m Sailing Yacht", flag: "Cayman Islands", openJobs: 1 },
                    ].map((vessel, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium">{vessel.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vessel.type} • {vessel.flag}
                          </p>
                        </div>
                        <Badge variant="secondary">{vessel.openJobs} open jobs</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/owner/vessels/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vessel
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Hiring Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Pipeline</CardTitle>
                  <CardDescription>Candidates by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: "New Applications", count: 15, color: "bg-blue-500" },
                      { stage: "Shortlisted", count: 8, color: "bg-purple-500" },
                      { stage: "Interview", count: 3, color: "bg-amber-500" },
                      { stage: "Offer", count: 1, color: "bg-green-500" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.stage}</span>
                          <span className="text-sm font-bold">{item.count}</span>
                        </div>
                        <Progress value={(item.count / 47) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/owner/candidates">
                        <Users className="h-5 w-5" />
                        <span className="text-sm">Browse Crew</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/owner/jobs/new">
                        <Plus className="h-5 w-5" />
                        <span className="text-sm">Post Job</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/owner/messages">
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-sm">Messages</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/owner/vessels">
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">My Vessels</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
