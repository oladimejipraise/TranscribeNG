import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import Features from "./Features";
import Languages from "./Languages";
import CodeSwitchDemo from "./CodeSwitchDemo";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark text-cream">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Languages />
        <CodeSwitchDemo />
        <HowItWorks />
        <Pricing />
      </main>

      <div className="flex gap-8 justify-center items-center py-5 bg-white/[0.02] border-t border-subtle flex-wrap">
        {[
          { icon: "💬", label: "Built for African conversations" },
          { icon: "🔊", label: "Handles noisy audio"            },
          { icon: "🔒", label: "Secure & Private"               },
          { icon: "📶", label: "Works Offline (Mobile)"         },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-cream/40">
            <span>{item.icon}</span>{item.label}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}