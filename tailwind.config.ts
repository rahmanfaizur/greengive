import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0a0a0f',
                surface: '#12121a',
                border: '#1e1e2e',
                accent: {
                    DEFAULT: '#6C63FF',
                    hover: '#5a52e0',
                    muted: '#6C63FF33',
                },
                impact: {
                    DEFAULT: '#00D4AA',
                    hover: '#00b892',
                    muted: '#00D4AA22',
                },
                text: {
                    DEFAULT: '#f0f0f5',
                    muted: '#6b6b80',
                    subtle: '#3a3a50',
                },
                warning: '#f5a623',
                danger: '#ef4444',
                success: '#00D4AA',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                display: ['var(--font-cabinet)', 'Cabinet Grotesk', 'Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-accent': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
                'gradient-subtle': 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)',
                'gradient-glow': 'radial-gradient(ellipse at top, #6C63FF15 0%, transparent 70%)',
            },
            boxShadow: {
                'glow-accent': '0 0 20px rgba(108, 99, 255, 0.3)',
                'glow-impact': '0 0 20px rgba(0, 212, 170, 0.3)',
                'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px #1e1e2e',
            },
            borderRadius: {
                xl: '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease forwards',
                'slide-up': 'slideUp 0.5s ease forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.5)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
