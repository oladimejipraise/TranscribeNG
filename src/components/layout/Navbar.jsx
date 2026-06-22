import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Features",     href: "#features"      },
  { label: "Languages",    href: "#languages"      },
  { label: "How it works", href: "#how-it-works"  },
  { label: "Pricing",      href: "#pricing"        },
];

export default function Navbar() {
  const { pathname }   = useLocation();
  const { user }       = useAuth();
  const isHome         = pathname === "/";

  function handleNavClick(e, href) {
    if (isHome) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <nav className="sticky top-0 bg-dark/90 backdrop-blur-md z-50 border-b border-subtle">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        <Link to="/"><Logo size="sm" /></Link>

        <ul className="flex gap-8 list-none">
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

        <div className="flex items-center gap-3">
          {user ? (
            // Logged-in user — show dashboard shortcuts
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="primary" size="sm">Upload Audio</Button>
              </Link>
            </>
          ) : (
            // Guest — show auth buttons
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}