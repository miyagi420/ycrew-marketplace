import { CrewNav } from "@/components/navigation/crew-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ship, MapPin, Calendar, MessageSquare } from "lucide-react"

export default function CrewApplicationsPage() {
  const applications = [
    {
      id: 1,
      title: "Chief Stew",
      vessel: "60m Motor Yacht",
      location: "Mediterranean",
      appliedDate: "Jan 15, 2025",
      status: "shortlisted",
    },
    {
      id: 2,
      title: "Deckhand",
      vessel: "45m Sailing Yacht",
      location: "Caribbean",
      appliedDate: "Jan 12, 2025",
      status: "interview",
    },
    {
      id: 3,
      title: "Bosun",
      vessel: "55m Motor Yacht",
      location: "Monaco",
      appliedDate: "Jan 10, 2025",
      status: "applied",
    },
    {
      id: 4,
      title: "Stew",
      vessel: "70m Superyacht",
      location: "French Riviera",
      appliedDate: "Jan 8, 2025",
      status: "rejected",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "interview":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "applied":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <CrewNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track your job applications and their status</p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({applications.filter((a) => ["applied", "shortlisted", "interview"].includes(a.status)).length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({applications.filter((a) => a.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{app.title}</h3>
                        <p className="text-sm text-muted-foreground">Applied on {app.appliedDate}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Ship className="h-4 w-4 text-muted-foreground" />
                        <span>{app.vessel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{app.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{app.appliedDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <MessageSquare className="h-4 w-4" />
                        Message Owner
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      {app.status === "applied" && (
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {applications
                .filter((a) => ["applied", "shortlisted", "interview"].includes(a.status))
                .map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{app.title}</h3>
                          <p className="text-sm text-muted-foreground">Applied on {app.appliedDate}</p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <span>{app.vessel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{app.appliedDate}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <MessageSquare className="h-4 w-4" />
                          Message Owner
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {applications
                .filter((a) => a.status === "rejected")
                .map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{app.title}</h3>
                          <p className="text-sm text-muted-foreground">Applied on {app.appliedDate}</p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <span>{app.vessel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{app.appliedDate}</span>
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
