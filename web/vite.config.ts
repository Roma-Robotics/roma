import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Ensure a single React instance so R3F hooks resolve correctly when
    // the simulator chunk is lazy-loaded.
    dedupe: ['react', 'react-dom', 'scheduler'],
  },
  optimizeDeps: {
    // Pre-bundle the 3D stack so it lives in the same dep graph as React.
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
})
