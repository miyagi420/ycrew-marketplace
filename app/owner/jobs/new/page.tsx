import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Sparkles } from "lucide-react"

export default function NewJobPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
            <p className="text-muted-foreground">Find the perfect crew member for your vessel</p>
          </div>

          <form className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vessel">Vessel</Label>
                  <Select>
                    <SelectTrigger id="vessel">
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">M/Y Azure Dream (60m Motor Yacht)</SelectItem>
                      <SelectItem value="2">S/Y Ocean Spirit (45m Sailing Yacht)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="e.g., Chief Stew, Deckhand, Engineer" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Primary Role</Label>
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="captain">Captain</SelectItem>
                      <SelectItem value="first-officer">First Officer</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="deckhand">Deckhand</SelectItem>
                      <SelectItem value="stew">Stew</SelectItem>
                      <SelectItem value="bosun">Bosun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Job Description</Label>
                    <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Sparkles className="h-4 w-4" />
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Employment terms and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-type">Contract Type</Label>
                    <Select>
                      <SelectTrigger id="contract-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day Rate</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days, if applicable)</Label>
                  <Input id="duration" type="number" placeholder="e.g., 90 for seasonal" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itinerary">Itinerary</Label>
                  <Textarea id="itinerary" placeholder="Mediterranean summer season, Caribbean winter..." rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>Qualifications and experience needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-experience">Minimum Experience (months)</Label>
                  <Input id="min-experience" type="number" placeholder="e.g., 24" />
                </div>

                <div className="space-y-3">
                  <Label>Required Certifications</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">
                      STCW Basic Safety
                      <button type="button" className="ml-2 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                    <Badge variant="secondary">
                      ENG1 Medical
                      <button type="button" className="ml-2 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Add certification requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stcw">STCW Basic Safety</SelectItem>
                      <SelectItem value="stcw-advanced">STCW Advanced</SelectItem>
                      <SelectItem value="eng1">ENG1 Medical</SelectItem>
                      <SelectItem value="coc">Certificate of Competency</SelectItem>
                      <SelectItem value="food-safety">Food Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Skills</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-1" />
                      <Label htmlFor="skill-1" className="font-normal cursor-pointer">
                        Navigation experience
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-2" />
                      <Label htmlFor="skill-2" className="font-normal cursor-pointer">
                        Maintenance skills
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="skill-3" />
                      <Label htmlFor="skill-3" className="font-normal cursor-pointer">
                        Guest service experience
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
                <CardDescription>Salary and benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day-rate">Day Rate (optional)</Label>
                    <Input id="day-rate" type="number" placeholder="150" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-rate">Monthly Rate</Label>
                    <Input id="monthly-rate" type="number" placeholder="3500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation & Benefits</Label>
                  <Textarea
                    id="accommodation"
                    placeholder="Describe accommodation, meals, travel, insurance, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
