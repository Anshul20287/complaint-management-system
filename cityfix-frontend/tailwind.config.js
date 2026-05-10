/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg:      '#03060f',
        surface: '#0b0f1e',
        accent:  '#00f5d4',
        accent2: '#7c6fff',
        muted:   '#6b7a99',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity:'1',   transform:'scale(1)'   },
          '50%':     { opacity:'0.4', transform:'scale(0.7)' },
        },
        float: {
          '0%,100%': { transform:'translateY(0)'     },
          '50%':     { transform:'translateY(-12px)' },
        },
        pingPin: {
          '0%':   { transform:'scale(1)',   opacity:'0.4' },
          '100%': { transform:'scale(2.5)', opacity:'0'   },
        },
        fadeUp: {
          from: { opacity:'0', transform:'translateY(28px)' },
          to:   { opacity:'1', transform:'translateY(0)'    },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.5s infinite',
        float:    'float 5s ease-in-out infinite',
        pingPin:  'pingPin 2s infinite',
        fadeUp:   'fadeUp 0.65s ease both',
      },
    },
  },
  plugins: [],
};
