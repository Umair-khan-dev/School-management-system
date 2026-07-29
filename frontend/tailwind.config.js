/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843'
        },
        ink: {
          800: '#241b2f',
          900: '#1a1424',
          950: '#120d1a'
        }
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(157, 23, 77, 0.08), 0 1px 2px -1px rgba(157, 23, 77, 0.08)',
        soft: '0 4px 16px -4px rgba(157, 23, 77, 0.15)'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #db2777 0%, #9d174d 55%, #4c1d95 100%)'
      }
    }
  },
  plugins: []
}
