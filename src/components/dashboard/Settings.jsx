import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const LANGUAGES = ["Auto Detect", "Yoruba", "Hausa", "Igbo", "English"];

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    features: ["30 min transcription/mo", "1 user", "3 languages", "Standard export"],
  },
  {
    name: "Pro",
    price: "₦4,500",
    popular: true,
    features: ["Unlimited transcription", "Translate to English", "AI Summaries", "Priority support"],
  },
  {
    name: "Team",
    price: "₦12,000",
    features: ["Everything in Pro", "Team workspace", "Share & collaborate", "User roles"],
  },
];

export default function Settings() {
  const { user }              = useAuth();
  const [searchParams]        = useSearchParams();
  const [activeTab, setActiveTab]         = useState("password");
  const [defaultLang, setDefaultLang]     = useState("Auto Detect");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    emailOnExport:   false,
    productUpdates:  true,
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordMsg,  setPasswordMsg]  = useState("");
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const TABS = [
    { id: "password",      label: "Password"      },
    { id: "language",      label: "Language"      },
    { id: "notifications", label: "Notifications" },
    { id: "billing",       label: "Billing"       },
  ];

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordMsg("");

    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg("New passwords do not match");
      return;
    }
    if (passwordForm.newPass.length < 8) {
      setPasswordMsg("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("tng_token");
      const res   = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.current,
            newPassword:     passwordForm.newPass,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPasswordMsg("✅ Password updated successfully");
        setPasswordForm({ current: "", newPass: "", confirm: "" });
      } else {
        setPasswordMsg(data.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordMsg("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
            >
              <span className="block w-5 h-0.5 bg-cream/70" />
              <span className="block w-5 h-0.5 bg-cream/70" />
              <span className="block w-5 h-0.5 bg-cream/70" />
            </button>
            <div>
              <h1 className="font-syne font-bold text-xl md:text-2xl text-cream">Settings</h1>
              <p className="text-sm text-cream/40 mt-0.5 hidden md:block">Manage your account preferences</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-subtle overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-cream/40 hover:text-cream"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Change Password */}
          {activeTab === "password" && (
            <div className="bg-surface border border-subtle rounded-2xl p-6 max-w-md">
              <h2 className="font-syne font-semibold text-base text-cream mb-5">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                {[
                  { label: "Current password",    name: "current", value: passwordForm.current },
                  { label: "New password",         name: "newPass", value: passwordForm.newPass },
                  { label: "Confirm new password", name: "confirm", value: passwordForm.confirm },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-xs text-cream/50 mb-1.5 block">{field.label}</label>
                    <input
                      type="password"
                      value={field.value}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [field.name]: e.target.value })}
                      className="w-full bg-white/5 border border-subtle text-cream text-sm rounded-lg px-4 py-2.5 outline-none focus:border-forest transition-colors"
                      required
                    />
                  </div>
                ))}
                {passwordMsg && (
                  <p className={`text-xs px-3 py-2 rounded-lg border ${
                    passwordMsg.includes("✅")
                      ? "text-accent bg-forest/10 border-forest/20"
                      : "text-red-400 bg-red-500/10 border-red-500/20"
                  }`}>
                    {passwordMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-forest hover:bg-forest/80 text-cream text-sm font-medium py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 mt-1"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}

          {/* Default Language */}
          {activeTab === "language" && (
            <div className="bg-surface border border-subtle rounded-2xl p-6 max-w-md">
              <h2 className="font-syne font-semibold text-base text-cream mb-2">Default Language</h2>
              <p className="text-sm text-cream/40 mb-6">
                This language will be pre-selected every time you upload or record audio.
              </p>
              <div className="flex flex-col gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setDefaultLang(lang)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                      defaultLang === lang
                        ? "border-forest bg-forest/10 text-accent"
                        : "border-subtle text-cream/50 hover:border-white/15 hover:text-cream"
                    }`}
                  >
                    {lang}
                    {defaultLang === lang && <span className="text-accent">✓</span>}
                  </button>
                ))}
              </div>
              <button className="mt-4 bg-forest hover:bg-forest/80 text-cream text-sm font-medium py-2.5 px-6 rounded-lg transition-all cursor-pointer">
                Save preference
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-surface border border-subtle rounded-2xl p-6 max-w-md">
              <h2 className="font-syne font-semibold text-base text-cream mb-2">Notifications</h2>
              <p className="text-sm text-cream/40 mb-6">Choose what emails you receive from TranscribeNG.</p>
              <div className="flex flex-col gap-5">
                {[
                  { key: "emailOnComplete", label: "Transcription complete", desc: "Get notified when your audio finishes transcribing"     },
                  { key: "emailOnExport",   label: "Export ready",           desc: "Get notified when your export file is ready to download" },
                  { key: "productUpdates",  label: "Product updates",        desc: "Hear about new features and improvements"               },
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-cream">{item.label}</p>
                      <p className="text-xs text-cream/35 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`relative rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 mt-0.5 ${
                        notifications[item.key] ? "bg-forest" : "bg-white/10"
                      }`}
                      style={{ width: "40px", height: "22px", minWidth: "40px" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                        style={{ left: notifications[item.key] ? "20px" : "2px" }}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-6 bg-forest hover:bg-forest/80 text-cream text-sm font-medium py-2.5 px-6 rounded-lg transition-all cursor-pointer">
                Save preferences
              </button>
            </div>
          )}

          {/* Plan & Billing */}
          {activeTab === "billing" && (
            <div>
              <div className="bg-forest/10 border border-forest/20 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-2xs text-accent uppercase tracking-widest mb-1">Current plan</p>
                  <p className="font-syne font-bold text-xl text-cream">Free</p>
                  <p className="text-xs text-cream/40 mt-0.5">30 minutes transcription per month</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xs text-cream/30 mb-1">Minutes used</p>
                  <p className="font-syne font-bold text-lg text-cream">0 / 30</p>
                </div>
              </div>

              <h2 className="font-syne font-semibold text-base text-cream mb-4">Upgrade your plan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl border p-5 ${
                      plan.popular ? "border-forest/50 bg-forest/6" : "border-subtle bg-surface"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest text-cream text-2xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
                        Most Popular
                      </div>
                    )}
                    <p className="text-2xs text-cream/40 uppercase tracking-widest mb-1">{plan.name}</p>
                    <p className="font-syne font-bold text-2xl text-cream mb-4">
                      {plan.price}<span className="text-sm font-normal text-cream/40">/mo</span>
                    </p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-cream/60">
                          <span className="text-accent mt-0.5 flex-shrink-0">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        plan.name === "Free"
                          ? "border border-subtle text-cream/30 cursor-not-allowed"
                          : plan.popular
                          ? "bg-forest hover:bg-forest/80 text-cream"
                          : "border border-subtle text-cream/50 hover:text-cream hover:border-white/20"
                      }`}
                      disabled={plan.name === "Free"}
                    >
                      {plan.name === "Free" ? "Current plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}