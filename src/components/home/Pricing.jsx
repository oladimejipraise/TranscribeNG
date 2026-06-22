import { useState } from "react";
import Button from "../ui/Button";

const PLANS = [
  {
    name: "Free",
    price: { monthly: "₦0", yearly: "₦0" },
    tagline: "Perfect for getting started.",
    btn: { label: "Get Started", variant: "outline" },
    popular: false,
    features: ["30 minutes transcription/mo", "1 user", "Transcribe in 3 languages", "Export (DOCX, PDF, TXT, SRT)", "Standard transcription"],
  },
  {
    name: "Pro",
    price: { monthly: "₦4,500", yearly: "₦3,600" },
    tagline: "For professionals and individuals.",
    btn: { label: "Start Pro Trial", variant: "primary" },
    popular: true,
    features: ["Unlimited transcription", "Translate to English", "AI Summaries", "WhatsApp import", "Priority support"],
  },
  {
    name: "Team",
    price: { monthly: "₦12,000", yearly: "₦9,600" },
    tagline: "For growing teams.",
    btn: { label: "Start Team Plan", variant: "outline" },
    popular: false,
    features: ["Everything in Pro", "Team workspace", "Share & collaborate", "User roles & permissions", "Priority support"],
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    tagline: "For organisations with advanced needs.",
    btn: { label: "Contact Sales", variant: "outline" },
    popular: false,
    features: ["Everything in Team", "Custom integrations (API)", "On-premise deployment", "Dedicated support", "SLA & compliance"],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section id="pricing" className="max-w-[1100px] mx-auto px-6 md:px-12 py-16 md:py-20 text-center">
      <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">Pricing</p>
      <h2 className="font-syne font-bold text-3xl md:text-[40px] leading-tight tracking-tight text-cream mb-4">
        Simple pricing for everyone
      </h2>
      <p className="text-base text-cream/50 font-light mb-8 max-w-md mx-auto leading-relaxed">
        All plans include secure storage and are built for Nigerian languages.
      </p>

      <div className="inline-flex bg-white/5 rounded-lg p-1 gap-1 mb-12">
        {["monthly", "yearly"].map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${
              billing === b ? "bg-forest text-cream" : "text-cream/50 hover:text-cream"
            }`}
          >
            {b === "yearly" ? "Yearly (save 20%)" : "Monthly"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-left">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl p-6 border ${
              plan.popular ? "border-forest/50 bg-forest/6" : "border-subtle bg-surface"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest text-cream text-2xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
                Most Popular
              </div>
            )}
            <p className="text-2xs text-cream/40 tracking-widest uppercase mb-2">{plan.name}</p>
            <p className="font-syne font-bold text-[28px] leading-none text-cream mb-1">
              {plan.price[billing]}
              {plan.price[billing] !== "Custom" && <span className="text-sm font-normal text-cream/40"> /mo</span>}
            </p>
            <p className="text-xs text-cream/40 mb-5 leading-snug">{plan.tagline}</p>
            <Button variant={plan.btn.variant} size="sm" className="w-full justify-center">
              {plan.btn.label}
            </Button>
            <hr className="border-t border-subtle my-4" />
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-cream/60 leading-snug">
                  <span className="text-accent mt-0.5 flex-shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}