/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.pug"],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'palette-1': {
          light: '#eceff1',
          dark: '#121212',
        },
        'palette-2': {
          light: '#222',
          dark: '#e0e0e0',
        },
        'palette-3': {
          light: '#757575',
          dark: '#9e9e9e',
        },
        'palette-4': {
          light: '#e1e1e1',
          dark: '#333333',
        },
        'palette-5': {
          light: '#00796b',
          dark: '#4db6ac',
        },
        'palette-6': {
          light: '#4db6ac',
          dark: '#00796b',
        },
      },
      fontFamily: {
        'karla': ['Karla', 'sans-serif'],
      },
    },
  },
  safelist: [
    'icon-twitter',
    'icon-github',
    'icon-linkedin',
    'icon-paper-plane',
  ],
  plugins: [],
}
