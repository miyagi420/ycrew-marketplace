import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, CheckCircle2, Search, MapPin, Briefcase, Calendar, MessageSquare, FileText, X } from "lucide-react"
import Link from "next/link"

export default function JobCandidatesPage() {
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
      match: 95,
      status: "applied",
      appliedDate: "Jan 16, 2025",
      coverLetter:
        "I am very interested in this position and believe my 8 years of experience as Chief Stew on luxury yachts makes me an ideal candidate...",
    },
    {
      id: 2,
      name: "Emma Williams",
      role: "Chief Stew",
      experience: "10 years",
      location: "French Riviera",
      availability: "March 2025",
      rating: 5.0,
      verified: true,
      match: 92,
      status: "shortlisted",
      appliedDate: "Jan 15, 2025",
      coverLetter: "With over 10 years of experience in luxury yacht service...",
    },
    {
      id: 3,
      name: "Jessica Martinez",
      role: "Chief Stew",
      experience: "6 years",
      location: "Barcelona",
      availability: "Feb 2025",
      rating: 4.8,
      verified: true,
      match: 88,
      status: "interview",
      appliedDate: "Jan 14, 2025",
      coverLetter: "I would love to bring my passion for hospitality...",
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
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/owner/jobs">← Back to Jobs</Link>
            </Button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Chief Stew - Candidates</h1>
                <p className="text-muted-foreground">M/Y Azure Dream • 18 applications</p>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Export List
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search candidates..." className="pl-9" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
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
                  </SelectContent>
                </Select>
                <Select defaultValue="match">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="date">Application Date</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All (18)</TabsTrigger>
              <TabsTrigger value="applied">New (15)</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted (2)</TabsTrigger>
              <TabsTrigger value="interview">Interview (1)</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
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
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{candidate.name}</h3>
                              {candidate.verified && (
                                <CheckCircle2 className="h-4 w-4 text-primary" title="Verified Profile" />
                              )}
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {candidate.match}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{candidate.role}</p>
                          </div>
                          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>{candidate.experience}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{candidate.availability}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span>{candidate.rating} rating</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{candidate.coverLetter}</p>
                        </div>

                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>View Full Application</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{candidate.name}'s Application</DialogTitle>
                                <DialogDescription>Applied on {candidate.appliedDate}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Cover Letter</h4>
                                  <p className="text-sm text-muted-foreground">{candidate.coverLetter}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Experience</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.experience} in luxury yachting
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Certifications</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">STCW Basic Safety</Badge>
                                    <Badge variant="secondary">ENG1 Medical</Badge>
                                    <Badge variant="secondary">Food Safety Level 2</Badge>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <Button className="flex-1">Shortlist Candidate</Button>
                                  <Button variant="outline" className="flex-1 bg-transparent">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {candidate.status === "applied" && (
                            <Button variant="outline" className="bg-transparent">
                              Shortlist
                            </Button>
                          )}
                          {candidate.status === "shortlisted" && (
                            <Button variant="outline" className="bg-transparent">
                              Schedule Interview
                            </Button>
                          )}
                          {candidate.status === "interview" && (
                            <Button variant="outline" className="bg-transparent">
                              Make Offer
                            </Button>
                          )}

                          <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Application</DialogTitle>
                                <DialogDescription>Provide feedback to {candidate.name} (optional)</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea placeholder="Thank you for your application..." rows={4} />
                                <div className="flex gap-3">
                                  <Button variant="outline" className="flex-1 bg-transparent">
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" className="flex-1">
                                    Reject Application
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="applied" className="space-y-4">
              {candidates
                .filter((c) => c.status === "applied")
                .map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
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
                          <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{candidate.role}</p>
                          <Button>View Application</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {candidates
                .filter((c) => c.status === "shortlisted")
                .map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
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
                          <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{candidate.role}</p>
                          <Button>Schedule Interview</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              {candidates
                .filter((c) => c.status === "interview")
                .map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
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
                          <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{candidate.role}</p>
                          <Button>Make Offer</Button>
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
