import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'weavy-bg': {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
        },
        'weavy-border': '#2a2a2a',
        'weavy-text': {
          primary: '#ffffff',
          secondary: '#a0a0a0',
        },
        'weavy-accent': {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      spacing: {
        'sidebar': '280px',
        'sidebar-collapsed': '60px',
      },
    },
  },
  plugins: [],
}
export default config

