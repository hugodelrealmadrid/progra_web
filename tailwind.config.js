/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amc: {
          verde: '#1D6A34',
          oscuro: '#155027',
          acento: '#2A8A4A',
          claro: '#D6EFD8',
          palido: '#EAF4EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
