import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // If using React, adjust for other frameworks

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to network; this sets host to '0.0.0.0'
    port: 5173, // You can set a specific port if desired
  },
});
