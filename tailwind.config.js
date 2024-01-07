/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts}"],
  // important: "#root",
  theme: {
    extend: {
      //landing
      lineHeight:{
        lh14:['3.5rem'],
      },
      width:{
        imghead:['250px'],
        imgheadsmall:['155px']
      },
      height:{
        imghead:['410px'],
        imgheadsmall:['360px']
      },

      colors:{
        'main':'#10375C',
        'bdcolor':'#2E80CE'
      }

    },
  },
  plugins: [],
};
