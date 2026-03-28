import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-yellow border-b-2 border-black px-8 py-20 text-center relative overflow-hidden">
        <div className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">Pricing</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">Simple,<br />transparent pricing</h1>
        <p className="text-gray-700 text-lg max-w-lg mx-auto">No hidden fees, no monthly charges. You only pay when you make a sale.</p>
      </div>

      {/* Two-tone split */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-black">
        <div className="bg-lav-soft px-12 py-16 text-center border-r-2 border-black">
          <div className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4">10%</div>
          <p className="text-gray-700 max-w-xs mx-auto leading-relaxed">Per transaction for all sales through your profile or direct links to your customers.</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-pill font-bold text-sm">Your own traffic</div>
        </div>
        <div className="bg-teal px-12 py-16 text-center">
          <div className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4 text-white">10%</div>
          <p className="text-white/80 max-w-xs mx-auto leading-relaxed">Same flat fee when buyers discover you through the Paxlava marketplace.</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-pill font-bold text-sm">Marketplace traffic</div>
        </div>
      </div>

      {/* Merchant of record */}
      <div className="px-8 py-16 text-center border-b-2 border-black bg-white">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Tax management</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">We&apos;re the Merchant<br />of Record</h2>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">Paxlava handles ALL your tax obligations. We manage sales tax collection and remittance worldwide — so you don&apos;t have to.</p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t-2 border-l-2 border-black">
        {[
          {
            name: 'Free listing', price: '$0', note: 'per project listed', featured: false,
            features: [
              { yes: true,  text: 'List unlimited projects'  },
              { yes: true,  text: 'Seller profile page'      },
              { yes: true,  text: 'Buyer messaging'          },
              { yes: true,  text: 'Live demo link'           },
              { yes: false, text: 'Featured placement'       },
              { yes: false, text: 'Priority support'         },
            ],
            cta: 'Get started', href: '/auth/signup',
          },
          {
            name: 'Per sale', price: '10%', note: 'platform fee per transaction', featured: true,
            features: [
              { yes: true, text: 'Everything in Free'         },
              { yes: true, text: 'Escrow payment protection'  },
              { yes: true, text: 'Dispute resolution'         },
              { yes: true, text: 'Analytics dashboard'        },
              { yes: true, text: 'Multi-currency payouts'     },
              { yes: true, text: 'Verified seller badge'      },
            ],
            cta: 'Start selling →', href: '/auth/signup',
          },
          {
            name: 'Enterprise', price: 'Custom', note: 'for high-volume sellers', featured: false,
            features: [
              { yes: true, text: 'Everything in Per sale'     },
              { yes: true, text: 'Reduced platform fee'       },
              { yes: true, text: 'Featured placement'         },
              { yes: true, text: 'Dedicated account manager'  },
              { yes: true, text: 'Custom contracts'           },
              { yes: true, text: 'API access'                 },
            ],
            cta: 'Contact us', href: '/about',
          },
        ].map(plan => (
          <div key={plan.name} className={`border-r-2 border-b-2 border-black p-8 relative ${plan.featured ? 'bg-amber' : 'bg-cream'}`}>
            {plan.featured && (
              <div className="absolute top-4 right-4 bg-black text-white text-xs font-black px-3 py-1 rounded-pill">Most popular</div>
            )}
            <div className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">{plan.name}</div>
            <div className="text-5xl font-black tracking-tighter mb-1">{plan.price}</div>
            <div className="text-sm text-gray-500 mb-6">{plan.note}</div>
            <ul className="space-y-2.5 mb-8">
              {plan.features.map(f => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  {f.yes ? <Check size={14} className="text-teal shrink-0 mt-0.5" /> : <X size={14} className="text-gray-300 shrink-0 mt-0.5" />}
                  <span className={!f.yes ? 'text-gray-400' : ''}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href}>
              <button className={`w-full py-3 rounded-pill font-black border-2 border-black text-sm transition-colors btn-gum ${plan.featured ? 'bg-black text-white hover:bg-gray-800' : 'bg-transparent hover:bg-black hover:text-white'}`}>
                {plan.cta}
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="px-8 py-16 bg-white border-t-2 border-black">
        <h2 className="text-4xl font-black tracking-tight text-center mb-10">Frequently asked questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black rounded-xl overflow-hidden max-w-4xl mx-auto">
          {[
            { q: 'When do I get paid?',               a: 'Funds release from escrow within 24h after the buyer confirms delivery. Payouts processed weekly via Stripe.' },
            { q: 'What currencies are supported?',    a: 'USD, EUR, AZN, RUB, GBP. Buyers pay in their currency; you receive your chosen payout currency.' },
            { q: 'Is there a listing fee?',           a: 'No. Listing is completely free. We only take 10% when a sale is made.' },
            { q: 'What if there\'s a dispute?',       a: 'Our team reviews the full conversation history and delivery evidence. Funds stay in escrow until resolved.' },
            { q: 'Can I offer custom projects?',      a: 'Yes. Buyers can message you about custom work. All negotiations happen on-platform.' },
            { q: 'How do I reduce the 10% fee?',      a: 'High-volume sellers (>$10k/month) can apply for our Enterprise plan with a reduced fee.' },
          ].map((faq, i) => (
            <div key={i} className={`p-6 ${i % 2 === 0 ? 'border-r-2' : ''} border-b-2 border-black last:border-b-0`}>
              <div className="font-black mb-2">{faq.q}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber border-t-2 border-black px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Start for free today.</h2>
        <p className="text-gray-700 mb-8 text-lg">No upfront cost. You only pay when you make a sale.</p>
        <Link href="/auth/signup">
          <button className="px-10 py-4 bg-black text-white rounded-pill font-black text-lg border-2 border-black hover:bg-gray-800 transition-colors btn-gum btn-gum-lg">
            Create free account →
          </button>
        </Link>
      </div>
    </>
  )
}
