import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function TeamWorkspace() {
  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <div className="w-16 h-16 rounded-2xl bg-forest/15 flex items-center justify-center text-3xl mx-auto mb-6">
            👥
          </div>
          <h1 className="font-syne font-bold text-2xl text-cream mb-3">Team Workspace</h1>
          <p className="text-sm text-cream/40 leading-relaxed mb-8">
            Collaborate with your team on transcripts. Invite members, share recordings,
            assign roles, and work together in real time. Coming soon.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { icon: "✉", label: "Invite team members" },
              { icon: "🔒", label: "Role-based access" },
              { icon: "📂", label: "Shared transcript library" },
              { icon: "💬", label: "Collaborative editing" },
            ].map((f) => (
              <div key={f.label} className="bg-surface border border-subtle rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-xs text-cream/50">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-accent text-xs px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Coming soon
          </div>
        </div>
      </main>
    </div>
  );
}