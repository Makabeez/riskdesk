import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 5174 is taken by the Sentinel frontend on this machine. strictPort: fail
  // loudly instead of silently moving to another port.
  server: { port: 5176, strictPort: true },
  preview: { port: 5176, strictPort: true },
});
