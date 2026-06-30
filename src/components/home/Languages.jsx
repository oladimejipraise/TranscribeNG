const LANGUAGES = [
  {
    flag: "🇳🇬",
    name: "Yoruba",
    sample: "Ẹ káàrọ̀ sir, mo dúpẹ́ pẹ̀ ẹ wá bá mi sọ ọ̀rọ̀ níi.",
    translation:
      "Good morning sir, thank you for coming to speak with me today.",
    color: "border-forest/30 bg-forest/5",
    badge: "text-accent bg-forest/15 border-forest/25",
  },
  {
    flag: "🇳🇬",
    name: "Hausa",
    sample: "Sannu da zuwa, ina farin cikin ganinka a yau.",
    translation: "Welcome, I am happy to see you today.",
    color: "border-blue-500/20 bg-blue-500/5",
    badge: "text-blue-400 bg-blue-500/10 border-blue-400/20",
  },
  {
    flag: "🇳🇬",
    name: "Igbo",
    sample: "Ọ dị mma ịhụ gị, anyị na-atọ ụtọ ịnọ ebe a.",
    translation: "It is good to see you, we are glad to be here.",
    color: "border-purple-500/20 bg-purple-500/5",
    badge: "text-purple-400 bg-purple-500/10 border-purple-400/20",
  },
];

const FEATURES = ["Transcription", "Translation", "Code-switching"];

export default function Languages() {
  return (
    <section
      id="languages"
      className="max-w-[1100px] mx-auto px-6 md:px-12 py-16 md:py-20"
    >
      <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">
        Languages
      </p>
      <h2 className="font-syne font-bold text-3xl md:text-[40px] leading-tight tracking-tight text-cream mb-4">
        Built for how Nigerians
        <br />
        actually speak
      </h2>
      <p className="text-base text-cream/50 max-w-[480px] leading-relaxed font-light mb-12">
        Full support for Nigeria's three major languages — plus Pidgin English
        and seamless code-switching between all of them.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {LANGUAGES.map((lang) => (
          <div
            key={lang.name}
            className={`border rounded-2xl p-4 md:p-6 transition-all duration-200 ${lang.color}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 md:mb-5">
              <span className="text-2xl md:text-3xl">{lang.flag}</span>
              <div>
                <h3 className="font-syne font-bold text-base md:text-lg text-cream">
                  {lang.name}
                </h3>
                <span
                  className={`text-2xs px-2 py-0.5 rounded-full border font-medium ${lang.badge}`}
                >
                  Fully supported
                </span>
              </div>
            </div>

            {/* Sample text — hidden on mobile to save space */}
            <div className="hidden md:block bg-black/20 rounded-xl p-4 mb-5 border border-white/5">
              <p className="text-sm text-cream leading-relaxed mb-2">
                {lang.sample}
              </p>
              <p className="text-xs text-cream/40 italic">{lang.translation}</p>
            </div>

            {/* Features — show as inline on mobile, list on desktop */}
            <div className="flex gap-3 md:flex-col md:gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 text-xs text-cream/60"
                >
                  <span className="text-accent">✓</span>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-subtle rounded-2xl px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-syne font-semibold text-base text-cream mb-1">
            + Pidgin English & Code-switching
          </p>
          <p className="text-sm text-cream/40 leading-relaxed">
            Nigerians naturally mix languages mid-sentence. TranscribeNG detects
            and handles these transitions automatically.
          </p>
        </div>
        <div className="bg-black/20 rounded-xl px-5 py-3 border border-white/5 text-sm leading-7 flex-shrink-0">
          <p>
            <span className="text-cream">We go start the meeting </span>
            <span className="text-accent">yanzu</span>
            <span className="text-cream">.</span>
          </p>
          <p>
            <span className="text-cream">Make </span>
            <span className="text-accent/70">we </span>
            <span className="text-cream">discuss the </span>
            <span className="text-accent">wadata</span>
            <span className="text-cream">.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
