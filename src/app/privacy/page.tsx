import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — Paxlava' }

export default function PrivacyPage() {
  return (
    <>
      <div className="px-8 py-12 border-b-2 border-black">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Legal</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-3">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: March 1, 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-14 space-y-10">
        {[
          {
            heading: '1. Information We Collect',
            body: 'We collect information you provide directly: name, email address, and profile photo when you create an account. We also collect transaction data (project purchases, sale history), messages sent through the Platform, and usage data (pages visited, search queries, device type).',
          },
          {
            heading: '2. How We Use Your Information',
            body: 'We use your information to operate the Platform, process payments via Stripe, send transactional emails (purchase confirmations, payout notifications), prevent fraud, and improve the Platform. We do not sell your personal data to third parties.',
          },
          {
            heading: '3. Data Sharing',
            body: 'We share your data with: Stripe (payment processing), Firebase/Google (infrastructure and authentication), and our hosting provider (Netlify). We may disclose data if required by law or to protect the rights, property, or safety of Paxlava or its users.',
          },
          {
            heading: '4. Message Monitoring',
            body: 'Messages sent on the Platform are scanned in real-time by automated systems to detect and block contact information (phone numbers, email addresses, Telegram handles, etc.) as part of our on-platform communication policy. Human review occurs only in the context of dispute resolution.',
          },
          {
            heading: '5. Cookies',
            body: 'We use session cookies for authentication and localStorage for user preferences (e.g., language selection). We do not use third-party advertising cookies.',
          },
          {
            heading: '6. Data Retention',
            body: 'Account data is retained for as long as your account is active. Transaction records are retained for 7 years for tax and legal compliance purposes. You may request deletion of your account and associated data at any time, subject to legal retention requirements.',
          },
          {
            heading: '7. Your Rights',
            body: 'You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask us to stop processing it by contacting privacy@paxlava.com. For users in the EU/EEA, you have additional rights under GDPR.',
          },
          {
            heading: '8. Security',
            body: 'We use industry-standard security measures including HTTPS encryption, Firebase Authentication, and Stripe for payment security. We do not store payment card information on our servers.',
          },
          {
            heading: '9. Children',
            body: 'Paxlava is not directed to children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us at privacy@paxlava.com.',
          },
          {
            heading: '10. Contact',
            body: 'For privacy-related questions or requests, contact us at privacy@paxlava.com.',
          },
        ].map(section => (
          <div key={section.heading}>
            <h2 className="text-xl font-black tracking-tight mb-3">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
