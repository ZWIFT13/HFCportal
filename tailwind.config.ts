// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './public/**/*.{svg}',
    'node_modules/react-datepicker/dist/**/*.{css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
