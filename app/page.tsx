import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Anchor, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Connect Verified Yacht Crew with Quality Opportunities
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              The trusted marketplace for yacht owners and professional crew. Find your perfect match in 72 hours or
              less.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-up?role=crew">I'm Looking for Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-up?role=owner">I'm Hiring Crew</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why CrewMatch?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for the yachting industry with compliance and quality at the core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Profiles</CardTitle>
                <CardDescription>
                  All crew profiles include verified certifications, documents, and background checks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Matching</CardTitle>
                <CardDescription>
                  Smart algorithms match crew skills, certifications, and availability with job requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Compliance Ready</CardTitle>
                <CardDescription>
                  Built-in STCW, MLC 2006, and flag-state compliance tracking and reminders
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">72h</div>
              <div className="text-muted-foreground">Average Time to Match</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Verified Crew Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">Active Vessels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Fill Rate in 7 Days</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Crew */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                For Crew
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Your Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload your CV, certifications, and set your availability
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Matched</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI finds jobs that match your skills and preferences
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Apply & Connect</h4>
                    <p className="text-sm text-muted-foreground">
                      Message directly with owners and secure your next position
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Owners */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Anchor className="h-6 w-6 text-primary" />
                For Owners
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Post Your Job</h4>
                    <p className="text-sm text-muted-foreground">Describe your requirements and vessel details</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Review Matches</h4>
                    <p className="text-sm text-muted-foreground">See verified crew that meet your exact criteria</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Hire with Confidence</h4>
                    <p className="text-sm text-muted-foreground">Interview, make offers, and onboard compliant crew</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of yacht professionals finding their perfect match
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Anchor className="h-5 w-5 text-primary" />
                <span className="font-bold">CrewMatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The trusted marketplace for yacht crew and owners worldwide
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Crew</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/find-jobs" className="hover:text-foreground">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-foreground">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/find-crew" className="hover:text-foreground">
                    Find Crew
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="hover:text-foreground">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 CrewMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
