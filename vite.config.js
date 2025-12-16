import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/final-ecommerce-app/"  // <-- required for GitHub Pages
});
