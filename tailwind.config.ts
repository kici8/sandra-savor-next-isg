import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        aujournuit: ["var(--font-aujournuit)", "serif"],
        ronzino: ["var(--font-ronzino)", "sans-serif"],
      },
      maxWidth: {
        container2560: "2560px",
      },
      colors: {
        "light-color": "rgb(37, 39, 38)",
        "light-bg": "#FFF7ED",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
