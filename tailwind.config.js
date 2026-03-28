/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:      '#FAF8F3',
        amber:      '#E8A838',
        'amber-light': '#FFC84D',
        teal:       '#23A094',
        yellow:     '#F9C74F',
        cobalt:     '#7B9CF5',
        coral:      '#E76F51',
        sage:       '#52B788',
        lav:        '#9B8FE8',
        'lav-soft': '#C8B2FF',
        ink:        '#1C1C1C',
      },
      fontFamily: {
        sans: ['var(--font-mona)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
      },
      boxShadow: {
        hard:      '3px 4px 0 #000',
        'hard-lg': '5px 6px 0 #000',
        'hard-sm': '2px 2px 0 #000',
      },
      keyframes: {
        'marquee-left': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'coin-drop': {
          '0%':   { transform: 'translateY(-60px) rotate(0deg)', opacity: '0' },
          '15%':  { opacity: '1' },
          '100%': { transform: 'translateY(60px) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'marquee-left':  'marquee-left  32s linear infinite',
        'marquee-right': 'marquee-right 36s linear infinite',
        'marquee-slow':  'marquee-left  50s linear infinite',
        'slide-up':      'slide-up  0.5s ease both',
        'fade-in':       'fade-in   0.4s ease both',
        'scale-in':      'scale-in  0.4s ease both',
        'coin-drop':     'coin-drop 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
