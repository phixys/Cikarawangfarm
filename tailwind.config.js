/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark:   '#2D6A4F',
          medium: '#40916C',
          light:  '#74C69D',
          tint:   '#F0FFF4',
          tint2:  '#D8F3DC',
        },
        danger: '#EF4444',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
