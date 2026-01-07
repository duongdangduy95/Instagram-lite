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
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-hide': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thumb-gray-600': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'rgb(75 85 99)',
            'border-radius': '9999px',
          },
        },
        '.scrollbar-thumb-gray-500': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'rgb(107 114 128)',
            'border-radius': '9999px',
          },
        },
        '.scrollbar-track-transparent': {
          '&::-webkit-scrollbar-track': {
            'background-color': 'transparent',
          },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
        },
      })
    },
  ],
}
