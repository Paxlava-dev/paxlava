import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service — Paxlava' }

export default function TermsPage() {
  return (
    <>
      <div className="px-8 py-12 border-b-2 border-black">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Legal</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-3">Terms of Service</h1>
        <p className="text-gray-500">Last updated: March 1, 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-14 space-y-10">
        {[
          {
            heading: '1. Acceptance of Terms',
            body: 'By accessing or using Paxlava ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform. We may update these terms at any time; continued use constitutes acceptance of the updated terms.',
          },
          {
            heading: '2. Platform Description',
            body: 'Paxlava is a marketplace connecting sellers of ready-made IT projects (websites, apps, scripts, SaaS tools) with buyers seeking those products. Paxlava acts as an intermediary and is not a party to the transaction between buyers and sellers.',
          },
          {
            heading: '3. Seller Responsibilities',
            body: 'Sellers must ensure that all listed projects are original work or that they hold the rights to sell the project. Sellers must accurately describe their projects, including tech stack, features, and any third-party dependencies. Sellers must not share contact information (phone, email, Telegram, WhatsApp, etc.) in listings or messages on the Platform.',
          },
          {
            heading: '4. Buyer Responsibilities',
            body: 'Buyers must review project details and request a demo before purchasing. Buyers must confirm delivery of the purchased project within 7 days of receiving it. Failure to confirm within 7 days will result in automatic escrow release to the seller.',
          },
          {
            heading: '5. Payments & Escrow',
            body: 'All payments are processed through Stripe. When a buyer completes a purchase, funds are held in escrow until the buyer confirms delivery or the 7-day auto-release period expires. Paxlava retains a 10% platform fee from each sale. Payouts are processed weekly.',
          },
          {
            heading: '6. Disputes',
            body: 'If a buyer believes the delivered project does not match the listing description, they may open a dispute within 7 days of delivery. Paxlava\'s support team will review the conversation history, delivery evidence, and listing details. Paxlava\'s decision is final.',
          },
          {
            heading: '7. Prohibited Conduct',
            body: 'Users must not share personal contact information in messages or listings, attempt to circumvent the Platform to conduct off-platform transactions, upload malicious code, spam other users, or engage in fraudulent activity. Violations may result in immediate account termination.',
          },
          {
            heading: '8. Intellectual Property',
            body: 'Sellers retain copyright to their projects unless explicitly transferred to the buyer. Buyers receive a license to use and modify the purchased project for their own purposes. Resale of purchased projects on Paxlava or other platforms requires explicit seller consent.',
          },
          {
            heading: '9. Limitation of Liability',
            body: 'Paxlava is not liable for any indirect, incidental, or consequential damages arising from use of the Platform. Our maximum liability in any dispute is limited to the amount of the transaction fee collected.',
          },
          {
            heading: '10. Contact',
            body: 'For questions about these Terms, contact us at legal@paxlava.com.',
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
