// lumina_pct/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // This line is crucial: it tells Tailwind to scan all .js, .ts, .jsx, and .tsx files
    // within your src/ directory and its subdirectories for Tailwind classes.
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
