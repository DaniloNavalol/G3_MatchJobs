/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Esta linha é crucial para o React
    "./public/index.html",      // Opcional, mas boa prática
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
