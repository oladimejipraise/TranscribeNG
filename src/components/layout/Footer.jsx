import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-12 py-6 border-t border-subtle">
      <Logo size="xs" />
      <p className="text-xs text-cream/25 italic">"Understanding African conversations, one voice at a time."</p>
      <p className="text-xs text-cream/25">TranscribeNG © 2024. All rights reserved.</p>
    </footer>
  );
}