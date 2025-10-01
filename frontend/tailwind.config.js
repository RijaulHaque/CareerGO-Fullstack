// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // --- ADD THIS 'content' BLOCK ---
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all files in the src folder
  ],
  // ---------------------------------
  theme: {
    extend: {},
  },
  plugins: [],
}