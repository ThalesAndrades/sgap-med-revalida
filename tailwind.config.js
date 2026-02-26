/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        inep: {
          primary: '#1e3a5f', // Azul-Marinho Profundo (Confiança, Institucional)
          secondary: '#152a45', 
          light: '#3b5c85',
          accent: '#e6f0ff', // Azul muito claro para fundos de destaque
        },
        action: {
          cta: '#00BFA6', // Verde Água Vibrante (Ação positiva, "Começar")
          ctaHover: '#009e8a',
          warning: '#FF8C42', // Laranja (Atenção, Cronômetro)
          danger: '#FF4D4D', // Vermelho (Erro, Parar)
        },
        clinical: {
          bg: '#f4f6f8', // Cinza muito suave (Menos cansaço visual que branco puro)
          surface: '#ffffff',
          text: '#2d3748', // Cinza escuro (Melhor leitura que preto puro)
          muted: '#718096',
          border: '#e2e8f0',
          success: '#48bb78',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'], // Para textos longos de leitura (casos)
        mono: ['JetBrains Mono', 'monospace'], // Para dados numéricos/timer
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 40px -10px rgba(0,0,0,0.2)',
        'glow': '0 0 15px rgba(0, 191, 166, 0.5)', // Glow para botões CTA
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
