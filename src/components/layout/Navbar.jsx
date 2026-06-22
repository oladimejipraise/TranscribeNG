import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Features",     href: "#features"     },
  { label: "Languages",    href: "#languages"     },
  { label: "How it works", href: "#how-it-works"  },
  { label: "Pricing",      href: "#pricing"       },
];

export default function Navbar() {
  const { pathname }          = useLocation();
  const { user }              = useAuth();
  const isHome                = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavClick(e, href) {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="sticky top-0 bg-dark/90 backdrop-blur-md z-50 border-b border-subtle">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link to="/"><Logo size="sm" /></Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-cream/60 hover:text-cream transition-colors duration-200 no-underline cursor-pointer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <Link to="/dashboard"><Button variant="primary" size="sm">Upload Audio</Button></Link>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
        >
          <span className={`block w-5 h-0.5 bg-cream/70 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-cream/70 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-cream/70 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-subtle bg-dark/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={isHome ? link.href : `/${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-cream/60 hover:text-cream transition-colors py-2 no-underline cursor-pointer border-b border-subtle last:border-0"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-center">Dashboard</Button>
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full justify-center">Upload Audio</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-center">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full justify-center">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}