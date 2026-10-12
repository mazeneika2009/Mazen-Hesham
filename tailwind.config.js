/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: '#0A0C0E',
        'ground-secondary': '#101317',
        ink: '#EDE7DC',
        'ink-secondary': '#9EA5A8',
        muted: '#6C7378',
        amber: '#E8913C',
        teal: '#2E6B72',
        hairline: 'rgba(237,231,220,0.13)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.03em',
        'tighter': '-0.02em',
        'labels': '0.12em',
        'labels-wide': '0.15em',
      },
      spacing: {
        'nav': '58px',
      },
      backdropBlur: {
        'nav': '14px',
      },
      animation: {
        'drift': 'drift 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
