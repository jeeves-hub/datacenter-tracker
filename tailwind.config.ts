import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stage: {
          concept: "#6366f1",
          permits: "#f59e0b",
          approved: "#10b981",
          rejected: "#ef4444",
          construction: "#3b82f6",
          operational: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};

export default config;