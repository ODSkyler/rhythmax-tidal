/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#070709',
          surface: '#0F0F14',
          elevated: '#17171E',
          hover: '#1E1E27',
          card: '#12121A',
        },
        accent: {
          DEFAULT: '#02D4A0',
          dim: 'rgba(2, 212, 160, 0.12)',
          bright: '#00FFBE',
          glow: 'rgba(2, 212, 160, 0.25)',
        },
        purple: {
          accent: '#7C6FF7',
          dim: 'rgba(124, 111, 247, 0.15)',
        },
        text: {
          primary: '#ECEBF5',
          secondary: '#7A79A0',
          muted: '#4A4965',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          bright: 'rgba(255,255,255,0.12)',
        }
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'spin-slow': 'spin 8s linear infinite',
        'equalizer': 'equalizer 1.2s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        equalizer: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 30px rgba(2, 212, 160, 0.3)',
        'glow-sm': '0 0 15px rgba(2, 212, 160, 0.2)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'player': '0 -4px 40px rgba(0,0,0,0.6)',
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
      }
    },
  },
  plugins: [],
}
