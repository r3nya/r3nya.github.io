/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.njk'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'palette-1': {
          light: '#ffffff', // Light background
          dark: '#0d1117', // Dark background
        },
        'palette-2': {
          light: '#24292e', // Light text
          dark: '#c9d1d9', // Dark text
        },
        'palette-3': {
          light: '#586069', // Light secondary text
          dark: '#8b949e', // Dark secondary text
        },
        'palette-4': {
          light: '#f6f8fa', // Light secondary background
          dark: '#161b22', // Dark secondary background
        },
        'palette-5': {
          light: '#0366d6', // Light blue
          dark: '#58a6ff', // Dark blue
        },
        'palette-6': {
          light: '#6f42c1', // Light purple
          dark: '#bc8cff', // Dark purple
        },
        'gradient-from': {
          light: '#FCB595',
          dark: '#B58366',
        },
        'gradient-via': {
          light: '#9477F1',
          dark: '#6A55A8',
        },
        'gradient-to': {
          light: '#5BAEEB',
          dark: '#3A7AAE',
        },
      },
      fontFamily: {
        monocode: [
          'ui-monospace',
          'Cascadia Code',
          'Source Code Pro',
          'Menlo',
          'Consolas',
          'DejaVu Sans Mono',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
