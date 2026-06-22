export default function CodeSwitchDemo() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 md:px-12 pb-16 md:pb-20">
      <div className="bg-surface border border-subtle rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-2xs text-accent tracking-widest uppercase font-medium mb-3">Code-switch detection</p>
          <h3 className="font-syne font-bold text-2xl md:text-[28px] leading-tight tracking-tight text-cream mb-4">
            Nigerians mix languages.<br />TranscribeNG gets it.
          </h3>
          <p className="text-sm text-cream/50 leading-relaxed font-light">
            Our system doesn't get confused when a speaker switches between Hausa,
            Pidgin, and English mid-sentence. That's not a bug — it's how we talk.
          </p>
        </div>
        <div>
          <div className="bg-black/30 border-l-2 border-forest rounded-lg px-5 py-4 text-[15px] leading-8">
            <p><span className="text-cream">We go start the meeting </span><span className="text-accent">yanzu</span><span className="text-cream">.</span></p>
            <p><span className="text-cream">Make </span><span className="text-accent/70">we </span><span className="text-cream">discuss the </span><span className="text-accent">wadata </span><span className="text-cream">allocation.</span></p>
            <p><span className="text-accent">Allah</span><span className="text-cream">, this thing </span><span className="text-accent/70">don do </span><span className="text-accent">sosai</span><span className="text-cream">.</span></p>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[
              { color: "#e8ede6", label: "English" },
              { color: "#4dba80", label: "Hausa"   },
              { color: "#4dba80", label: "Pidgin", opacity: 0.7 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-2xs text-cream/40">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color, opacity: item.opacity || 1 }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}