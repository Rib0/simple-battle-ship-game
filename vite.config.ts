import { defineConfig, splitVendorChunkPlugin } from 'vite';
import path from 'path';

import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 8080,
		open: true,
	},
	plugins: [preact(), splitVendorChunkPlugin()],
});
