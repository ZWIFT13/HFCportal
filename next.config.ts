import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // รองรับ App Router ด้วยถ้าใช้
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
