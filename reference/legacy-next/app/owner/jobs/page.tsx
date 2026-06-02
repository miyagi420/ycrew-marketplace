import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Users, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function OwnerJobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Chief Stew",
      vessel: "M/Y Azure Dream",
      status: "open",
      applications: 18,
      shortlisted: 3,
      views: 142,
      postedDate: "Jan 15, 2025",
    },
    {
      id: 2,
      title: "Deckhand",
      vessel: "S/Y Ocean Spirit",
      status: "open",
      applications: 24,
      shortlisted: 4,
      views: 198,
      postedDate: "Jan 10, 2025",
    },
    {
      id: 3,
      title: "Engineer",
      vessel: "M/Y Azure Dream",
      status: "open",
      applications: 5,
      shortlisted: 1,
      views: 67,
      postedDate: "Jan 18, 2025",
    },
    {
      id: 4,
      title: "Chef",
      vessel: "M/Y Azure Dream",
      status: "filled",
      applications: 32,
      shortlisted: 5,
      views: 245,
      postedDate: "Dec 20, 2024",
    },
    {
      id: 5,
      title: "Bosun",
      vessel: "S/Y Ocean Spirit",
      status: "closed",
      applications: 15,
      shortlisted: 2,
      views: 123,
      postedDate: "Dec 15, 2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "filled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job Postings</h1>
              <p className="text-muted-foreground">Manage your crew positions</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/owner/jobs/new">
                <Plus className="h-4 w-4" />
                Post New Job
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({jobs.filter((j) => j.status === "open").length})</TabsTrigger>
              <TabsTrigger value="filled">Filled ({jobs.filter((j) => j.status === "filled").length})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({jobs.filter((j) => j.status === "closed").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.vessel} • Posted {job.postedDate}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Job</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Filled</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Close Job</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{job.applications}</p>
                          <p className="text-sm text-muted-foreground">Applications</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{job.shortlisted}</p>
                          <p className="text-sm text-muted-foreground">Shortlisted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-2xl font-bold">{job.views}</p>
                          <p className="text-sm text-muted-foreground">Profile Views</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={`/owner/jobs/${job.id}/candidates`}>View Candidates</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/owner/jobs/${job.id}/edit`}>Edit Job</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              {jobs
                .filter((j) => j.status === "open")
                .map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.vessel} • Posted {job.postedDate}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-2xl font-bold">{job.applications}</p>
                            <p className="text-sm text-muted-foreground">Applications</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-2xl font-bold">{job.shortlisted}</p>
                            <p className="text-sm text-muted-foreground">Shortlisted</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-2xl font-bold">{job.views}</p>
                            <p className="text-sm text-muted-foreground">Profile Views</p>
                          </div>
                        </div>
                      </div>

                      <Button asChild>
                        <Link href={`/owner/jobs/${job.id}/candidates`}>View Candidates</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="filled" className="space-y-4">
              {jobs
                .filter((j) => j.status === "filled")
                .map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.vessel} • Posted {job.postedDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              {jobs
                .filter((j) => j.status === "closed")
                .map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.vessel} • Posted {job.postedDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
