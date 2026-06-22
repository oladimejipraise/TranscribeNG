const LOGOS = ["BBC Pidgin", "The Trimmes", "TechCabal", "BudgIT", "YNaija"];

export default function TrustedBy() {
  return (
    <div className="border-t border-b border-subtle py-10 text-center">
      <p className="text-2xs text-cream/30 tracking-widest uppercase mb-5">Trusted by teams across Nigeria</p>
      <div className="flex gap-10 justify-center items-center flex-wrap">
        {[...LOGOS, "+ more"].map((name) => (
          <span key={name} className="font-syne font-bold text-sm text-cream/25 tracking-wide">{name}</span>
        ))}
      </div>
    </div>
  );
}