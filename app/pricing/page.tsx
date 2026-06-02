import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <div className="flex-1 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Crew Pricing */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">For Crew Members</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Get started with the basics</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Create profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">5 applications per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Basic messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Job alerts</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/sign-up?role=crew">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious job seekers</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€9.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Everything in Free</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">AI CV parser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Availability calendar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cert expiry reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Priority in search</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" asChild>
                    <Link href="/sign-up?role=crew">Start Pro Trial</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Elite</CardTitle>
                  <CardDescription>Maximum visibility</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€29.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verification badge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Reference checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Boosted ranking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Interview scheduling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/sign-up?role=crew">Get Elite</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Owner Pricing */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">For Yacht Owners</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Try before you commit</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">1 live job posting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Up to 20 AI matches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Basic messaging</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/sign-up?role=owner">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <div className="text-xs font-semibold text-primary mb-2">RECOMMENDED</div>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For active hiring</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited job postings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Full messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Bulk invites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Shortlists & notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Contract templates</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" asChild>
                    <Link href="/sign-up?role=owner">Start Pro</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For agencies & fleets</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€299</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Multi-vessel management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Team seats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          All plans include 14-day free trial. Cancel anytime.
        </div>
      </footer>
    </div>
  )
}
