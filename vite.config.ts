import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Deployed to GitHub Pages under the repository path.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/Helixona-Complex-Chronic-Program/',
  plugins: [react(), tailwindcss()],
})
