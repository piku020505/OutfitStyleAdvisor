/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#12110F',
        surface: '#1C1A17',
        'surface-elevated': '#24221E',
        'surface-card': '#2A2822',
        border: '#38342D',
        'border-subtle': '#2A2822',
        paper: '#F5F3EF',
        muted: '#9E9B93',
        'muted-dark': '#6B6862',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'swatch-reveal': 'swatchReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        swatchReveal: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
}
