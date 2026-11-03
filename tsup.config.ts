import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "gsap", "@gsap/react"],
  injectStyle: false, // We'll manage styles with tailwind separately
  // Todos los componentes usan hooks: sin esto, Next.js (App Router) falla al importarlos desde un Server Component.
  banner: { js: '"use client";' },
});