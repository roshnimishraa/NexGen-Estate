/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        body : ['Marcellus'],
        head : ['Italiana'],
      }
    },
  },
  plugins: [],
}

