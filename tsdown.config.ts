import { defineConfig } from "tsdown"

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  shims: true,
  clean: true,
  deps: { skipNodeModulesBundle: true },
})
