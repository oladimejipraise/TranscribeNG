const STEPS = [
  {
    number: "01",
    icon: "☁️",
    title: "Upload or record",
    desc: "Drag and drop an audio file — MP3, WAV, M4A or WhatsApp voice note — or record directly in your browser. No conversion needed.",
    detail: "Supports files up to 100MB",
    accent: "border-blue-500/30 bg-blue-500/5",
    iconBg: "bg-blue-500/15 border-blue-500/25",
    number_color: "text-blue-400",
    dot: "bg-blue-400",
  },
  {
    number: "02",
    icon: "🌐",
    title: "Detect & transcribe",
    desc: "TranscribeNG automatically detects the language — Yoruba, Hausa, Igbo, Pidgin or English — and transcribes every word with speaker labels and timestamps.",
    detail: "Powered by OpenAI Whisper",
    accent: "border-forest/30 bg-forest/5",
    iconBg: "bg-forest/15 border-forest/25",
    number_color: "text-accent",
    dot: "bg-accent",
  },
  {
    number: "03",
    icon: "🔁",
    title: "Translate to English",
    desc: "Toggle English translation on any transcript. Each line shows the original language alongside its English equivalent — useful for journalists and researchers.",
    detail: "Powered by Claude AI",
    accent: "border-purple-500/30 bg-purple-500/5",
    iconBg: "bg-purple-500/15 border-purple-500/25",
    number_color: "text-purple-400",
    dot: "bg-purple-400",
  },
  {
    number: "04",
    icon: "✨",
    title: "Get AI summary",
    desc: "After transcription, generate an AI summary that pulls out key points, action items and sentiment — so you can publish or share faster.",
    detail: "One click, instant results",
    accent: "border-yellow-500/30 bg-yellow-500/5",
    iconBg: "bg-yellow-500/15 border-yellow-500/25",
    number_color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    number: "05",
    icon: "↓",
    title: "Export in any format",
    desc: "Download your transcript as a Word document, PDF, plain text or SRT subtitle file. Set your preferred font, size, and whether to include timestamps and translations.",
    detail: "DOCX · PDF · TXT · SRT",
    accent: "border-orange-500/30 bg-orange-500/5",
    iconBg: "bg-orange-500/15 border-orange-500/25",
    number_color: "text-orange-400",
    dot: "bg-orange-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-[1100px] mx-auto px-12 py-20">
      <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">How it works</p>
      <h2 className="font-syne font-bold text-[40px] leading-tight tracking-tight text-cream mb-4">
        From audio to transcript<br />in five steps
      </h2>
      <p className="text-base text-cream/50 max-w-[480px] leading-relaxed font-light mb-16">
        No technical setup. No language selection required. Just upload and go.
      </p>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-forest/30 to-orange-500/30 hidden md:block" />

        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6 items-start group">

              {/* Step icon circle */}
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center z-10 relative transition-all duration-200 group-hover:scale-105 ${step.iconBg}`}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dark border border-white/10 flex items-center justify-center text-2xs font-bold ${step.number_color}`}>
                  {i + 1}
                </span>
              </div>

              {/* Card */}
              <div className={`flex-1 border rounded-2xl px-6 py-5 transition-all duration-200 group-hover:scale-[1.005] ${step.accent}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-syne font-semibold text-base text-cream mb-2">{step.title}</h3>
                    <p className="text-sm text-cream/55 leading-relaxed">{step.desc}</p>
                  </div>
                  <span className="text-2xs text-cream/30 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5">
                    {step.detail}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-forest/8 border border-forest/20 rounded-2xl px-8 py-8 flex items-center justify-between gap-8">
        <div>
          <h3 className="font-syne font-bold text-xl text-cream mb-2">
            Ready to try it yourself?
          </h3>
          <p className="text-sm text-cream/40">
            Free to start — no credit card required. 30 minutes of transcription every month on the free plan.
          </p>
        </div>
        <a
        
          href="/signup"
          className="flex-shrink-0 bg-forest hover:bg-forest/80 text-cream text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200"
        >
          Start for free →
        </a>
      </div>
    </section>
  );
}