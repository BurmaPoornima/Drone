/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3a86ff",
        secondary: "#8338ec",
        danger: "#ff006e",
        warning: "#fb5607",
        success: "#06d6a0"
      }
    },
  },
  plugins: [],
}
