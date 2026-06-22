import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

const NAV = [
  { icon: "▦",  label: "Dashboard",      path: "/dashboard" },
  { icon: "📄", label: "My Transcripts", path: "/dashboard/transcripts" },
  { icon: "🎙", label: "Live Recording", path: "/dashboard/record" },
  { icon: "👥", label: "Team Workspace", path: "/dashboard/team" },
  { icon: "↓",  label: "Exports",        path: "/dashboard/exports" },
  { icon: "⚙",  label: "Settings",       path: "/dashboard/settings" },
];

export default function Sidebar() {
  const { pathname }              = useLocation();
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef                   = useRef(null);


  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="w-64 h-screen sticky top-0 bg-dark border-r border-subtle flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-subtle">
        <Link to="/">
          <Logo size="xs" />
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 no-underline ${
                active
                  ? "bg-forest/20 text-accent font-medium"
                  : "text-cream/50 hover:text-cream hover:bg-white/5"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile area at bottom */}
      <div className="px-3 py-3 border-t border-subtle relative" ref={menuRef}>

        {/* Popup menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#111a15] border border-subtle rounded-xl overflow-hidden shadow-2xl z-50">

            {/* Email — non clickable */}
            <div className="px-4 py-3 border-b border-subtle">
              <p className="text-2xs text-cream/35 truncate">{user?.email || "user@example.com"}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={() => { navigate("/dashboard/settings"); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-all cursor-pointer text-left"
              >
                <span>⚙</span> Settings
              </button>
              <button
                onClick={() => { navigate("/dashboard/settings?tab=billing"); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-all cursor-pointer text-left"
              >
                <span>↑</span> Upgrade plan
              </button>
            </div>

            <div className="border-t border-subtle py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer text-left"
              >
                <span>→</span> Log out
              </button>
            </div>
          </div>
        )}

        {/* Profile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-forest/30 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 text-left flex-1">
            <p className="text-xs font-medium text-cream truncate">{user?.name || "User"}</p>
            <p className="text-2xs text-cream/35 truncate">{user?.email || "user@example.com"}</p>
          </div>
          <span className={`text-cream/30 text-xs transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
            ▲
          </span>
        </button>

      </div>
    </aside>
  );
}