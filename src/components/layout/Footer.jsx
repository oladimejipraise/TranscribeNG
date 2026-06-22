import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 gap-3 border-t border-subtle text-center md:text-left">
      <Logo size="xs" />
      <p className="text-xs text-cream/25 italic">"Understanding African conversations, one voice at a time."</p>
      <p className="text-xs text-cream/25">TranscribeNG © 2024. All rights reserved.</p>
    </footer>
  );
}