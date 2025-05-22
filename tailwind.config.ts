import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/react-datepicker/dist/react-datepicker.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
