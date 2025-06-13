
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class", '[data-theme="dark"]'],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Tree Tracker Theme Colors
				tree: {
					purple: '#8A33FD',
					green: '#4CAF50', 
					gold: '#FFD700',
					dark: '#1A1A2E',
					light: '#F5F5F9',
				},
				// Sydney Green Theme Colors
				'sydney-green': '#00FF66',
				'sydney-purple': '#6B46C1',
				'sydney-dark': '#0F0A19',
				'sydney-card': 'rgba(15, 10, 25, 0.9)',
				// Synthwave Theme Colors
				synthwave: {
					pink: '#ff79c6',
					purple: '#bd93f9',
					cyan: '#8be9fd',
					background: '#1e1b2e',
				},
				// Forest Theme Colors
				forest: {
					green: '#2e4f3e',
					light: '#d9ead3',
					brown: '#5d4037',
					accent: '#81c784',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(138, 51, 253, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(138, 51, 253, 0.8), 0 0 30px rgba(138, 51, 253, 0.5)' }
				},
				'ripple': {
					'0%': { boxShadow: '0 0 0px rgba(138, 51, 253, 0.8)', opacity: '1' },
					'100%': { boxShadow: '0 0 20px 10px rgba(138, 51, 253, 0)', opacity: '0' }
				},
				'synthwave-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(255, 121, 198, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(255, 121, 198, 0.8), 0 0 30px rgba(189, 147, 249, 0.5)' }
				},
				'sydney-glow': {
					'0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 102, 0.4)' },
					'50%': { boxShadow: '0 0 25px rgba(0, 255, 102, 0.8), 0 0 35px rgba(0, 255, 102, 0.4)' }
				},
				'forest-sway': {
					'0%, 100%': { transform: 'rotate(-1deg)' },
					'50%': { transform: 'rotate(1deg)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
				'float': 'float 3s infinite ease-in-out',
				'spin-slow': 'spin-slow 8s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s infinite ease-in-out',
				'glow': 'glow 2s infinite ease-in-out',
				'ripple': 'ripple 1.5s linear',
				'synthwave-glow': 'synthwave-glow 3s infinite ease-in-out',
				'sydney-glow': 'sydney-glow 3s infinite ease-in-out',
				'forest-sway': 'forest-sway 5s infinite ease-in-out',
			},
			backgroundImage: {
				'cannabis-pattern': "url('/cannabis-pattern.svg')",
				'gradient-purple': 'linear-gradient(135deg, #24243e 0%, #302b63 50%, #0f0c29 100%)',
				'psychedelic-gradient': 'linear-gradient(45deg, #ff00cc, #3333ff, #00ffcc, #ff00cc)',
				'synthwave-grid': "linear-gradient(180deg, rgba(30, 27, 46, 0) 0%, rgba(30, 27, 46, 0.3) 100%), url('/synthwave-grid.png')",
				'forest-texture': "url('/forest-bg.jpg')",
				'sydney-gradient': 'linear-gradient(135deg, #0f0a19 0%, #6b46c1 50%, #0f0a19 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
