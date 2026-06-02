import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ship, Plus, MapPin, Flag, Calendar, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function VesselsPage() {
  const vessels = [
    {
      id: 1,
      name: "M/Y Azure Dream",
      type: "Motor Yacht",
      length: 60,
      flag: "Malta",
      homeport: "Monaco",
      buildYear: 2018,
      openJobs: 2,
      crew: 12,
    },
    {
      id: 2,
      name: "S/Y Ocean Spirit",
      type: "Sailing Yacht",
      length: 45,
      flag: "Cayman Islands",
      homeport: "Antigua",
      buildYear: 2020,
      openJobs: 1,
      crew: 8,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Vessels</h1>
              <p className="text-muted-foreground">Manage your yacht fleet</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/owner/vessels/new">
                <Plus className="h-4 w-4" />
                Add Vessel
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {vessels.map((vessel) => (
              <Card key={vessel.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Ship className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{vessel.name}</CardTitle>
                        <CardDescription>
                          {vessel.length}m {vessel.type}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Crew</DropdownMenuItem>
                        <DropdownMenuItem>View Jobs</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove Vessel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{vessel.flag}</p>
                        <p className="text-muted-foreground">Flag State</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{vessel.homeport}</p>
                        <p className="text-muted-foreground">Homeport</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{vessel.buildYear}</p>
                        <p className="text-muted-foreground">Build Year</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ship className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{vessel.crew} crew</p>
                        <p className="text-muted-foreground">Capacity</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Badge variant="secondary">{vessel.openJobs} open positions</Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/owner/vessels/${vessel.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/owner/jobs/new?vessel=${vessel.id}`}>Post Job</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
