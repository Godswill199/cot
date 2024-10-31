/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tomorrow: ['Tomorrow', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        custom: {
          '900': 'rgb(48, 66, 84)',
          '200': 'rgb(255, 255, 255)',
          'custom-green': '#004d40',
          

        }
      }
    },
  },
  plugins: [],
  utilities: {
    marginBlockStart: ['margin-block-start'],
  },
}