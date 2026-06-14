import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["electron/main.ts", "electron/preload.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  external: ["electron"],
  outdir: "dist-electron",
  format: "cjs",
  sourcemap: true,
});
console.log("Electron main process built.");
