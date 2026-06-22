const SPEAKER_STYLES = {
  S1: "bg-forest/25 text-accent",
  S2: "bg-white/10 text-cream/70",
  S3: "bg-blue-500/15 text-blue-400",
  S4: "bg-purple-500/15 text-purple-400",
};

export default function SpeakerTag({ speaker }) {
  const style = SPEAKER_STYLES[speaker] || SPEAKER_STYLES.S1;
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${style}`}>
      {speaker}
    </div>
  );
}