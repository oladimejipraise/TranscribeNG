const FEATURES = [
  { icon: "🎙", title: "Real-time transcription",  desc: "Stream audio live and see text appear as words are spoken. Works with recordings too." },
  { icon: "🌐", title: "Code-switch detection",    desc: "Handles Yoruba, Hausa, Igbo, Pidgin and mid-sentence transitions naturally." },
  { icon: "👥", title: "Speaker detection",        desc: "Automatically separates and labels up to 6 different speakers in the same recording." },
  { icon: "📄", title: "AI summaries",             desc: "Get key points, action items, and sentiment analysis automatically after any session." },
  { icon: "🔁", title: "Translate to English",     desc: "Toggle between the original language and English translation with one click." },
  { icon: "💬", title: "WhatsApp import",          desc: "Forward voice notes directly into the platform. No conversion needed." },
];

export default function Features() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-16 md:py-20" id="features">
      <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">Features</p>
      <h2 className="font-syne font-bold text-3xl md:text-[40px] leading-tight tracking-tight text-cream mb-4">
        Everything you need<br />to transcribe Nigerian conversations
      </h2>
      <p className="text-base text-cream/50 max-w-[480px] leading-relaxed font-light mb-12">
        Built specifically for how Nigerians actually speak — not adapted from a Western tool.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-surface border border-subtle rounded-xl p-6 hover:bg-white/5 hover:border-forest/30 transition-all duration-200">
            <div className="text-2xl mb-4">{f.icon}</div>
            <h3 className="font-syne font-semibold text-base text-cream mb-2">{f.title}</h3>
            <p className="text-sm text-cream/50 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}