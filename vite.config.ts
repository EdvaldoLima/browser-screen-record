import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'BrowserScreen',
      fileName: () => 'index.js',
      formats: ['es']
    },
    outDir: './dist',
    emptyOutDir: false
  }
});
