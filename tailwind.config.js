/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.pug"],
  theme: {
    extend: {
      colors: {
        'palette-1': '#eceff1',
        'palette-2': '#222',
        'palette-3': '#757575',
        'palette-4': '#e1e1e1',
        'palette-5': '#00796b',
        'palette-6': '#4db6ac',
      },
      fontFamily: {
        'karla': ['Karla', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

