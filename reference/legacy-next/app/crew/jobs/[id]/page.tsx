import { CrewNav } from "@/components/navigation/crew-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Ship, MapPin, Calendar, DollarSign, Star, CheckCircle2, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  const job = {
    id: 1,
    title: "Chief Stew",
    vessel: {
      name: "M/Y Azure Dream",
      type: "Motor Yacht",
      length: 60,
      flag: "Malta",
      buildYear: 2018,
    },
    location: "Mediterranean",
    startDate: "March 15, 2025",
    contractType: "Seasonal",
    duration: "6 months",
    rate: "€4,500/month",
    match: 95,
    description:
      "We are seeking an experienced Chief Stew for our 60m motor yacht for the Mediterranean summer season. The ideal candidate will have extensive experience in luxury yacht service, excellent organizational skills, and a passion for delivering exceptional guest experiences.",
    responsibilities: [
      "Manage interior crew and daily operations",
      "Oversee guest services and ensure highest standards",
      "Coordinate with chef for meal planning and service",
      "Maintain inventory and order supplies",
      "Ensure all interior areas meet luxury standards",
    ],
    requirements: [
      "Minimum 5 years experience as Chief Stew on yachts 50m+",
      "STCW Basic Safety certification",
      "ENG1 Medical certificate",
      "Excellent English, French preferred",
      "Strong leadership and communication skills",
    ],
    certifications: ["STCW Basic Safety", "ENG1 Medical", "Food Safety Level 2"],
    benefits: [
      "Private cabin with ensuite",
      "All meals provided",
      "Crew uniform allowance",
      "Travel expenses covered",
      "Rotation schedule: 2 months on, 1 month off",
    ],
    postedDate: "January 15, 2025",
    applicants: 18,
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <CrewNav />

      <div className="flex-1 py-8">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/crew/matches">← Back to Matches</Link>
            </Button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-muted-foreground">{job.vessel.name}</p>
              </div>
              <Badge variant="secondary" className="gap-1 text-base px-4 py-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {job.match}% match
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-muted-foreground" />
                <span>
                  {job.vessel.length}m {job.vessel.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Starts {job.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{job.rate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{job.duration}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Required Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Accommodation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Vessel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Vessel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vessel Name</p>
                      <p className="font-medium">{job.vessel.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type</p>
                      <p className="font-medium">{job.vessel.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Length</p>
                      <p className="font-medium">{job.vessel.length}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Flag</p>
                      <p className="font-medium">{job.vessel.flag}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Build Year</p>
                      <p className="font-medium">{job.vessel.buildYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Homeport</p>
                      <p className="font-medium">Monaco</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>Submit your application to the owner</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cover-letter">Cover Letter</Label>
                    <Textarea id="cover-letter" placeholder="Tell the owner why you're a great fit..." rows={6} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expected-rate">Your Expected Rate (optional)</Label>
                    <Input id="expected-rate" type="number" placeholder="4500" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Profile Includes:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>CV and certifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Experience and references</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Availability dates</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Submit Application
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Owner
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Save Job
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted</span>
                    <span className="text-sm font-medium">{job.postedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applicants</span>
                    <span className="text-sm font-medium">{job.applicants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contract Type</span>
                    <Badge variant="secondary">{job.contractType}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Why You Match */}
              <Card>
                <CardHeader>
                  <CardTitle>Why You're a Great Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Your experience matches the role requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>You have all required certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Your availability aligns with start date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>You have experience on similar vessel types</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
