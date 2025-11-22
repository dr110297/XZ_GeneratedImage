/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Corporate Blue
          hover: '#1d4ed8',
          light: '#eff6ff',
        },
        text: {
          primary: '#111827', // Gray 900
          secondary: '#4b5563', // Gray 600
          regular: '#374151', // Gray 700
          placeholder: '#9ca3af', // Gray 400
        },
        bg: {
          base: '#ffffff', // White
          page: '#f3f4f6', // Gray 100
          card: '#ffffff', // White
          overlay: '#f9fafb', // Gray 50
        },
        border: {
          base: '#e5e7eb', // Gray 200
          light: '#f3f4f6', // Gray 100
        },
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      },
      borderRadius: {
        base: '0.5rem', // 8px
        small: '0.25rem', // 4px
        round: '9999px',
      },
      boxShadow: {
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        glow: '0 0 0 0 transparent', // Removed glow for standard style
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
