/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-elevated': '#F1F5F9',
        'surface-card': '#FFFFFF',
        border: '#E2E8F0',
        'border-subtle': '#CBD5E1',
        paper: '#0F172A',
        muted: '#64748B',
        'muted-dark': '#475569',
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
