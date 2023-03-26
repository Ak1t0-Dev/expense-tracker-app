/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        'dark': '0 4px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
