/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lpu: {
          orange: '#F15A24',
          'orange-hover': '#D94917',
          blue: '#0E2A47',
          navy: '#0A1C30',
          amber: '#FBBF24',
          card: '#FBFBFA',
          border: '#E8E8E4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'serif']
      },
      boxShadow: {
        'smooth': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(241, 90, 36, 0.25)',
      }
    },
  },
  plugins: [],
}
