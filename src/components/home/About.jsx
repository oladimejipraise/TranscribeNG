const STEPS = [
  {
    number: "01",
    icon: "☁️",
    title: "Upload or record",
    desc: "Drag and drop an audio file — MP3, WAV, M4A or WhatsApp voice note — or record directly in your browser. No conversion needed.",
    detail: "Supports files up to 100MB",
  },
  {
    number: "02",
    icon: "🌐",
    title: "Detect & transcribe",
    desc: "TranscribeNG automatically detects the language — Yoruba, Hausa, Igbo, Pidgin or English — and transcribes every word with speaker labels and timestamps.",
    detail: "Powered by OpenAI Whisper",
  },
  {
    number: "03",
    icon: "🔁",
    title: "Translate to English",
    desc: "Toggle English translation on any transcript. Each line shows the original language alongside its English equivalent — useful for journalists and researchers.",
    detail: "Powered by Claude AI",
  },
  {
    number: "04",
    icon: "✨",
    title: "Get AI summary",
    desc: "After transcription, generate an AI summary that pulls out key points, action items and sentiment — so you can publish or share faster.",
    detail: "One click, instant results",
  },
  {
    number: "05",
    icon: "↓",
    title: "Export in any format",
    desc: "Download your transcript as a Word document, PDF, plain text or SRT subtitle file. Set your preferred font, size, and whether to include timestamps and translations.",
    detail: "DOCX · PDF · TXT · SRT",
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
        {/* Vertical line connecting steps */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-forest/20 hidden md:block" />

        <div className="flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6 items-start group">

              {/* Step number circle */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-forest/15 border border-forest/30 flex flex-col items-center justify-center z-10 relative group-hover:bg-forest/25 transition-all duration-200">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dark border border-forest/40 flex items-center justify-center text-2xs text-accent font-bold">
                  {i + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-surface border border-subtle rounded-2xl px-6 py-5 group-hover:border-forest/20 group-hover:bg-white/[0.03] transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-syne font-semibold text-base text-cream mb-2">{step.title}</h3>
                    <p className="text-sm text-cream/50 leading-relaxed">{step.desc}</p>
                  </div>
                  <span className="text-2xs text-cream/25 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5">
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