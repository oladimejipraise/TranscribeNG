import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";
import Input from "../ui/Input";

export default function Signup() {
  const { signup }  = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="md" showTagline />
        </div>

        <div className="bg-surface border border-subtle rounded-2xl px-8 py-10">
          <h1 className="font-syne font-bold text-2xl text-cream mb-1">
            Create your account
          </h1>
          <p className="text-sm text-cream/40 mb-8">Start transcribing in minutes</p>

          <div className="flex flex-col gap-3 mb-6">
            <button className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-subtle text-cream text-sm py-2.5 rounded-lg transition-all duration-200 cursor-pointer">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-subtle text-cream text-sm py-2.5 rounded-lg transition-all duration-200 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.086 14.432l-3.59-3.59 1.414-1.414 2.176 2.176 4.676-4.676 1.414 1.414-6.09 6.09z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-subtle" />
            <span className="text-2xs text-cream/25">or</span>
            <hr className="flex-1 border-subtle" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                hint="Password must be at least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-cream/30 hover:text-cream/60 text-xs cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <Input
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest hover:bg-forest/90 text-cream font-medium py-3 rounded-lg transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-xs text-cream/30 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:text-accent/80 transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center text-2xs text-cream/20 mt-6 flex items-center justify-center gap-1.5">
          🔒 Secure, private and encrypted
        </p>
      </div>
    </div>
  );
}