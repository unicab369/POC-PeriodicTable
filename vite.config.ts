import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: { runes: true }
		})
	],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},
	base: process.env.BASE_PATH || '/'
});
