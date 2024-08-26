import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Adicione as extensões aqui
  },
});
