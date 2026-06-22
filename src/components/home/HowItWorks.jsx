const STEPS = [
  {
    icon: "☁️",
    title: "Upload or record",
    desc: "Drag and drop an audio file — MP3, WAV, M4A or WhatsApp voice note — or record directly in your browser. No conversion needed.",
    detail: "Supports files up to 100MB",
    accent: "border-blue-500/30 bg-blue-500/5",
    iconBg: "bg-blue-500/15 border-blue-500/25",
    numberColor: "text-blue-400",
  },
  {
    icon: "🌐",
    title: "Detect & transcribe",
    desc: "TranscribeNG automatically detects the language — Yoruba, Hausa, Igbo, Pidgin or English — and transcribes every word with speaker labels and timestamps.",
    detail: "Powered by OpenAI Whisper",
    accent: "border-forest/30 bg-forest/5",
    iconBg: "bg-forest/15 border-forest/25",
    numberColor: "text-accent",
  },
  {
    icon: "🔁",
    title: "Translate to English",
    desc: "Toggle English translation on any transcript. Each line shows the original language alongside its English equivalent.",
    detail: "Powered by Claude AI",
    accent: "border-purple-500/30 bg-purple-500/5",
    iconBg: "bg-purple-500/15 border-purple-500/25",
    numberColor: "text-purple-400",
  },
  {
    icon: "✨",
    title: "Get AI summary",
    desc: "After transcription, generate an AI summary that pulls out key points, action items and sentiment — so you can publish or share faster.",
    detail: "One click, instant results",
    accent: "border-yellow-500/30 bg-yellow-500/5",
    iconBg: "bg-yellow-500/15 border-yellow-500/25",
    numberColor: "text-yellow-400",
  },
  {
    icon: "↓",
    title: "Export in any format",
    desc: "Download your transcript as a Word document, PDF, plain text or SRT subtitle file. Set your preferred font, size, and whether to include timestamps.",
    detail: "DOCX · PDF · TXT · SRT",
    accent: "border-orange-500/30 bg-orange-500/5",
    iconBg: "bg-orange-500/15 border-orange-500/25",
    numberColor: "text-orange-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-[1100px] mx-auto px-6 md:px-12 py-16 md:py-20">
      <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">How it works</p>
      <h2 className="font-syne font-bold text-3xl md:text-[40px] leading-tight tracking-tight text-cream mb-4">
        From audio to transcript<br />in five steps
      </h2>
      <p className="text-base text-cream/50 max-w-[480px] leading-relaxed font-light mb-16">
        No technical setup. No language selection required. Just upload and go.
      </p>

      <div className="relative">
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-forest/30 to-orange-500/30 hidden md:block" />
        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4 md:gap-6 items-start group">
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center z-10 relative transition-all duration-200 group-hover:scale-105 ${step.iconBg}`}>
                  <span className="text-lg md:text-xl">{step.icon}</span>
                </div>
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dark border border-white/10 flex items-center justify-center text-2xs font-bold ${step.numberColor}`}>
                  {i + 1}
                </span>
              </div>
              <div className={`flex-1 border rounded-2xl px-4 md:px-6 py-4 md:py-5 transition-all duration-200 ${step.accent}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
                  <div>
                    <h3 className="font-syne font-semibold text-base text-cream mb-2">{step.title}</h3>
                    <p className="text-sm text-cream/55 leading-relaxed">{step.desc}</p>
                  </div>
                  <span className="text-2xs text-cream/30 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 self-start">
                    {step.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-forest/8 border border-forest/20 rounded-2xl px-6 md:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-syne font-bold text-xl text-cream mb-2">Ready to try it yourself?</h3>
          <p className="text-sm text-cream/40">Free to start — no credit card required. 30 minutes of transcription every month on the free plan.</p>
        </div>
        <a href="/signup" className="flex-shrink-0 bg-forest hover:bg-forest/80 text-cream text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200">
          Start for free →
        </a>
      </div>
    </section>
  );
}