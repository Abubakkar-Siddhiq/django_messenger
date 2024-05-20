/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg-image': "url('/src/assets/bg2.jpg')",
      },
      flex: {
        '2': '2 2 0%'
      },
    },
  },
  plugins: [],
}

