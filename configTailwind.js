tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "sans-serif"],
      },
      colors: {
        bg: "#f4f6f9",
        surface: "#ffffff",
        border: "#e8ecf1",
        text: "#1a1f2e",
        muted: "#7a8499",
        accent: "#2563eb",
        green: "#16a34a",
        red: "#dc2626",
        blue: "#2563eb",
        purple: "#7c3aed",
      },
      borderRadius: {
        lg: "20px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 0, 0, 0.06)",
        md: "0 8px 32px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.22s ease",
      },
    },
  },
};
