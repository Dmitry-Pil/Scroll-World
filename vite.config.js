import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	// serve GSAP as ESM; prebundling it probes parent folders outside this workspace
	optimizeDeps: { exclude: ['gsap'] }
});