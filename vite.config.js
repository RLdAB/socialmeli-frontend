import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": "http://localhost:8080",
      "/products": "http://localhost:8080",
      "/sellers": "http://localhost:8080",
      "/swagger": "http://localhost:8080",
    },
  },
});