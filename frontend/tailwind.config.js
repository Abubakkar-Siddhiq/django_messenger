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
      keyframes: {
        loadingFade: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        loadingFade: 'loadingFade 1s infinite',
      },
    },
  },
  plugins: [],
}

