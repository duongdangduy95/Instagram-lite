/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-primary': '#877EFF',
        'purple-primary-dark': '#7565E6',
      },
    },
  },
  plugins: [],
}
