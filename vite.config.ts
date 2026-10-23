import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Source entry lives in app/index.html. `npm run build` writes the production site to the
// repository root (index.html + assets/) so GitHub Pages serves it from the branch directly,
// and also to dist/ for the Actions deploy and screenshots.
export default defineConfig({
  root: 'app',
  publicDir: '../public',
  // Relative base: the same build works at github.io/<repo>/ and at a custom domain root.
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), tailwindcss()],
  build: { outDir: process.env.OUT_DIR ?? '../dist', emptyOutDir: process.env.OUT_DIR ? false : true },
})
