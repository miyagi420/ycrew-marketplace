import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase, Star, CheckCircle2 } from "lucide-react"

export default function CandidatesPage() {
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Stew",
      experience: "8 years",
      location: "Monaco",
      availability: "Available Now",
      rating: 4.9,
      verified: true,
      languages: ["English", "French", "Italian"],
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Deckhand",
      experience: "5 years",
      location: "Antigua",
      availability: "Feb 2025",
      rating: 4.7,
      verified: true,
      languages: ["English", "Spanish"],
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Chef",
      experience: "10 years",
      location: "French Riviera",
      availability: "March 2025",
      rating: 5.0,
      verified: true,
      languages: ["English", "French"],
    },
    {
      id: 4,
      name: "James Rodriguez",
      role: "Engineer",
      experience: "12 years",
      location: "Barcelona",
      availability: "Available Now",
      rating: 4.8,
      verified: true,
      languages: ["English", "Spanish", "Portuguese"],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Crew</h1>
            <p className="text-muted-foreground">Find verified professionals for your vessel</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search crew..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="captain">Captain</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="deckhand">Deckhand</SelectItem>
                    <SelectItem value="stew">Stew</SelectItem>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="now">Available Now</SelectItem>
                    <SelectItem value="month">Within 1 Month</SelectItem>
                    <SelectItem value="quarter">Within 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Candidates List */}
          <div className="grid md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            {candidate.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary" title="Verified Profile" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{candidate.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {candidate.availability}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">View Profile</Button>
                    <Button variant="outline">Message</Button>
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
