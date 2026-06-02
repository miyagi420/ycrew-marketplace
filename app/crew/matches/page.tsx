import { CrewNav } from "@/components/navigation/crew-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Calendar, DollarSign, Ship, Search } from "lucide-react"
import Link from "next/link"

export default function CrewMatchesPage() {
  const matches = [
    {
      id: 1,
      title: "Chief Stew",
      vessel: "60m Motor Yacht",
      vesselType: "Motor Yacht",
      location: "Mediterranean",
      startDate: "March 2025",
      rate: "€4,500/month",
      match: 95,
      description: "Seeking experienced chief stew for busy charter season in the Med.",
    },
    {
      id: 2,
      title: "Deckhand",
      vessel: "45m Sailing Yacht",
      vesselType: "Sailing Yacht",
      location: "Caribbean",
      startDate: "February 2025",
      rate: "€3,200/month",
      match: 88,
      description: "Looking for deckhand with sailing experience for Caribbean season.",
    },
    {
      id: 3,
      title: "Chef",
      vessel: "80m Superyacht",
      vesselType: "Superyacht",
      location: "French Riviera",
      startDate: "April 2025",
      rate: "€5,500/month",
      match: 82,
      description: "Private yacht seeking talented chef for Mediterranean cruising.",
    },
    {
      id: 4,
      title: "Bosun",
      vessel: "55m Motor Yacht",
      vesselType: "Motor Yacht",
      location: "Monaco",
      startDate: "March 2025",
      rate: "€4,000/month",
      match: 78,
      description: "Experienced bosun needed for maintenance and deck operations.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <CrewNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Job Matches</h1>
            <p className="text-muted-foreground">Jobs that match your profile and preferences</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jobs..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Vessel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="motor">Motor Yacht</SelectItem>
                    <SelectItem value="sailing">Sailing Yacht</SelectItem>
                    <SelectItem value="superyacht">Superyacht</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="med">Mediterranean</SelectItem>
                    <SelectItem value="caribbean">Caribbean</SelectItem>
                    <SelectItem value="pacific">Pacific</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="match">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="date">Start Date</SelectItem>
                    <SelectItem value="rate">Highest Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Matches List */}
          <div className="space-y-4">
            {matches.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          {job.match}% match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Ship className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{job.vessel}</p>
                        <p className="text-muted-foreground">{job.vesselType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{job.location}</p>
                        <p className="text-muted-foreground">Location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{job.startDate}</p>
                        <p className="text-muted-foreground">Start Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{job.rate}</p>
                        <p className="text-muted-foreground">Compensation</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/crew/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline">Save</Button>
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
