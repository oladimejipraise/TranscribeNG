export default function Input({ label, type = "text", placeholder, hint, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-cream/60 tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full bg-white/5 border ${
          error ? "border-red-500/50 focus:border-red-500" : "border-subtle focus:border-forest"
        } text-cream text-sm placeholder:text-cream/25 rounded-lg px-4 py-3 outline-none transition-all duration-200 ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-2xs text-cream/30">{hint}</p>}
      {error && <p className="text-2xs text-red-400">{error}</p>}
    </div>
  );
}