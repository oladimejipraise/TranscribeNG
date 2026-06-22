export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer rounded-lg";

  const variants = {
    primary:  "bg-forest text-cream hover:bg-forest/90 active:scale-[0.98]",
    ghost:    "bg-transparent border border-white/20 text-cream/80 hover:bg-white/5 hover:text-cream",
    outline:  "bg-transparent border border-white/20 text-cream/70 hover:bg-white/5",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}