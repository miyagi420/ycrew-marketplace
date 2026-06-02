import { CrewNav } from "@/components/navigation/crew-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, FileText, Star, TrendingUp, Briefcase, MessageSquare, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CrewDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <CrewNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, John</h1>
            <p className="text-muted-foreground">Here's what's happening with your job search</p>
          </div>

          {/* Profile Completeness Alert */}
          <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                    Complete your profile to get better matches
                  </h3>
                  <Progress value={65} className="mb-3 h-2" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                    Your profile is 65% complete. Add certifications and availability to improve your visibility.
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/crew/profile">Complete Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>New Matches</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>+3 this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Applications</CardDescription>
                <CardTitle className="text-3xl">5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>2 shortlisted</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Unread Messages</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>From 2 owners</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Profile Views</CardDescription>
                <CardTitle className="text-3xl">47</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>+12 this week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Matches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Matches</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/crew/matches">View All</Link>
                  </Button>
                </div>
                <CardDescription>Jobs that match your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Chief Stew",
                      vessel: "60m Motor Yacht",
                      location: "Mediterranean",
                      match: 95,
                      rate: "€4,500/month",
                    },
                    {
                      title: "Deckhand",
                      vessel: "45m Sailing Yacht",
                      location: "Caribbean",
                      match: 88,
                      rate: "€3,200/month",
                    },
                    {
                      title: "Chef",
                      vessel: "80m Superyacht",
                      location: "French Riviera",
                      match: 82,
                      rate: "€5,500/month",
                    },
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.vessel}</p>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                            {job.match}% match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{job.location}</span>
                          <span className="font-medium text-foreground">{job.rate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="space-y-6">
              {/* Certifications Expiring */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications Expiring Soon</CardTitle>
                  <CardDescription>Keep your documents up to date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">STCW Basic Safety</p>
                        <p className="text-xs text-muted-foreground">Expires in 45 days</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Renew
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">ENG1 Medical</p>
                        <p className="text-xs text-muted-foreground">Valid until Dec 2025</p>
                      </div>
                    </div>
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
                      <Link href="/crew/profile">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Update Profile</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/crew/profile#certifications">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm">Add Cert</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/crew/profile#availability">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Set Availability</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                      <Link href="/find-jobs">
                        <Briefcase className="h-5 w-5" />
                        <span className="text-sm">Browse Jobs</span>
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
