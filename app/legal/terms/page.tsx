import { MainNav } from "@/components/navigation/main-nav"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 py-20">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using CrewMatch, you agree to be bound by these Terms of Service and all applicable laws
              and regulations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are
              responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your profile information is accurate and up-to-date</li>
              <li>Verifying the authenticity of uploaded certifications</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false or misleading information</li>
              <li>Upload fraudulent certifications or documents</li>
              <li>Harass or discriminate against other users</li>
              <li>Use the platform for any illegal purposes</li>
              <li>Attempt to circumvent payment or subscription requirements</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Subscriptions and Payments</h2>
            <p>
              Paid subscriptions are billed in advance on a recurring basis. You may cancel your subscription at any
              time, but refunds are not provided for partial billing periods.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Verification and Compliance</h2>
            <p>
              CrewMatch provides tools to assist with maritime compliance, but users are ultimately responsible for
              ensuring they meet all applicable regulations, including STCW, MLC 2006, and flag-state requirements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p>
              CrewMatch is a marketplace platform and is not responsible for the actions of crew members or employers.
              We do not guarantee employment or the quality of crew members.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
            <p>For questions about these Terms, please contact us at legal@crewmatch.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
