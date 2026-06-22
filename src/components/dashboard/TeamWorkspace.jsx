import { useState } from "react";
import Sidebar from "./Sidebar";

export default function TeamWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Mobile header */}
        <div className="flex items-center gap-3 px-4 py-4 md:hidden border-b border-subtle">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1.5 cursor-pointer p-1"
          >
            <span className="block w-5 h-0.5 bg-cream/70" />
            <span className="block w-5 h-0.5 bg-cream/70" />
            <span className="block w-5 h-0.5 bg-cream/70" />
          </button>
          <h1 className="font-syne font-bold text-base text-cream">Team Workspace</h1>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center max-w-md">
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
                { icon: "✉", label: "Invite team members"     },
                { icon: "🔒", label: "Role-based access"       },
                { icon: "📂", label: "Shared transcript library" },
                { icon: "💬", label: "Collaborative editing"   },
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
        </div>

      </main>
    </div>
  );
}