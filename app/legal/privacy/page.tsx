import { MainNav } from "@/components/navigation/main-nav"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 py-20">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>
              CrewMatch ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our yacht crew marketplace
              platform.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information (experience, certifications, availability)</li>
              <li>Uploaded documents (CV, certificates, identification)</li>
              <li>Communication data (messages, applications)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Match crew members with suitable job opportunities</li>
              <li>Verify certifications and credentials</li>
              <li>Process payments and subscriptions</li>
              <li>Send notifications and updates</li>
              <li>Ensure compliance with maritime regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@crewmatch.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
