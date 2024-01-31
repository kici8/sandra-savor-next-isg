import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // TODO: remove, test with max
      // spacing: {
      //   "vwMax-0": "max(1.667vw,1rem)",
      //   "vwMax-1": "max(9.861vw,5.917rem)",
      //   "vwMax-2": "max(18.056vw,10.833rem)",
      //   "vwMax-3": "max(26.25vw,15.75rem)",
      //   "vwMax-4": "max(34.444vw,20.667rem)",
      //   "vwMax-5": "max(42.639vw,25.583rem)",
      //   "vwMax-6": "max(50.833vw,30.5rem)",
      //   "vwMax-7": "max(59.028vw,35.417rem)",
      //   "vwMax-8": "max(67.222vw,40.333rem)",
      //   "vwMax-9": "max(75.417vw,45.25rem)",
      //   "vwMax-10": "max(83.611vw,50.167rem)",
      //   "vwMax-11": "max(91.806vw,55.083rem)",
      //   "vwMax-12": "max(100vw,60rem)",
      // },
      spacing: {
        "vw-0": "1.667vw",
        "vw-1": "9.861vw",
        "vw-2": "18.056vw",
        "vw-3": "26.25vw",
        "vw-4": "34.444vw",
        "vw-5": "42.639vw",
        "vw-6": "50.833vw",
        "vw-7": "59.028vw",
        "vw-8": "67.222vw",
        "vw-9": "75.417vw",
        "vw-10": "83.611vw",
        "vw-11": "91.806vw",
        "vw-12": "100vw",
      },
    },
  },
  plugins: [],
};
export default config;
