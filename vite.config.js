import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: 'src/vanillaPasswordStrengthMeter.js',
			name: 'VanillaPasswordStrengthMeter',
			formats: ['es', 'umd'],
			fileName: (format) => `vanilla-password-strength-meter.${format}.js`
		},
		rollupOptions: {
			// Можно указать external, если есть внешние зависимости.
			// Например, если бы ты использовал jQuery, то external: ['jquery']
		}
	}
})
