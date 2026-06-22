import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // wire up to api.js in Phase 5
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="flex justify-center mb-10">
          <Logo size="md" showTagline />
        </div>

        <div className="bg-surface border border-subtle rounded-2xl px-8 py-10">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h1 className="font-syne font-bold text-2xl text-cream mb-2">Check your email</h1>
              <p className="text-sm text-cream/40 mb-8 leading-relaxed">
                We sent a password reset link to <span className="text-cream/70">{email}</span>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="text-sm text-accent hover:text-accent/80 transition-colors">
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-white/5 border border-subtle rounded-xl flex items-center justify-center text-2xl">
                  🔒
                </div>
              </div>

              <h1 className="font-syne font-bold text-2xl text-cream mb-1 text-center">Forgot password?</h1>
              <p className="text-sm text-cream/40 mb-8 text-center leading-relaxed">
                No worries. Enter your email address and we'll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="primary" size="lg" className="w-full justify-center mt-2">
                  Send reset link
                </Button>
              </form>

              <p className="text-center mt-6">
                <Link to="/login" className="text-sm text-accent hover:text-accent/80 transition-colors">
                  ← Back to login
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-2xs text-cream/20 mt-6 flex items-center justify-center gap-1.5">
          🔒 Secure, private and encrypted
        </p>
      </div>
    </div>
  );
}