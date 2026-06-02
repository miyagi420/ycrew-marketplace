import { CrewNav } from "@/components/navigation/crew-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Plus, X, FileText, CheckCircle2 } from "lucide-react"

export default function CrewProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <CrewNav />

      <div className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your professional information and certifications</p>
          </div>

          {/* Profile Photo & Basic Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your profile photo and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG or PNG, max 5MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="British" defaultValue="British" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeport">Homeport</Label>
                <Input id="homeport" placeholder="Monaco" defaultValue="Monaco" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">
                    English
                    <button className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  <Badge variant="secondary">
                    French
                    <button className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add language" />
                  <Button size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your experience..."
                  rows={4}
                  defaultValue="Experienced deckhand with 5+ years on superyachts. STCW certified with strong maintenance and navigation skills."
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience & Roles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Experience & Roles</CardTitle>
              <CardDescription>Your yachting experience and preferred positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-role">Primary Role</Label>
                  <Select defaultValue="deckhand">
                    <SelectTrigger id="primary-role">
                      <SelectValue />
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
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" type="number" placeholder="5" defaultValue="5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Roles</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">
                    Bosun
                    <button className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Add secondary role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stew">Stew</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Boat Types</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">
                    Motor Yacht
                    <button className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  <Badge variant="secondary">
                    Sailing Yacht
                    <button className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Add boat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superyacht">Superyacht</SelectItem>
                    <SelectItem value="catamaran">Catamaran</SelectItem>
                    <SelectItem value="expedition">Expedition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="boat-length-min">Min Boat Length (m)</Label>
                  <Input id="boat-length-min" type="number" placeholder="30" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boat-length-max">Max Boat Length (m)</Label>
                  <Input id="boat-length-max" type="number" placeholder="80" defaultValue="80" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="mb-6" id="certifications">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Upload and manage your maritime certifications</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "STCW Basic Safety", expiry: "2025-12-15", verified: true },
                  { name: "ENG1 Medical", expiry: "2025-11-20", verified: true },
                  { name: "RYA Yachtmaster", expiry: "2026-03-10", verified: false },
                ].map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{cert.name}</p>
                        {cert.verified && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Expires: {cert.expiry}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="mb-6" id="availability">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>When are you available to start work?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available-from">Available From</Label>
                  <Input id="available-from" type="date" defaultValue="2025-02-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available-until">Available Until</Label>
                  <Input id="available-until" type="date" defaultValue="2025-12-31" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Compensation Expectations</CardTitle>
              <CardDescription>Your minimum rate requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day-rate">Min Day Rate</Label>
                  <Input id="day-rate" type="number" placeholder="150" defaultValue="150" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-rate">Min Monthly Rate</Label>
                  <Input id="monthly-rate" type="number" placeholder="3500" defaultValue="3500" />
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
            </CardContent>
          </Card>

          {/* CV Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>CV / Resume</CardTitle>
              <CardDescription>Upload your latest CV for AI parsing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX (max 10MB)</p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
