import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["../src/mod.ts"],
  outDir: "../npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@abcnews/core-hash-converter",
    version: Deno.args[0],
    description:
      "A utility for converting strings to objects with various encodings structures.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/abcnews/core-hash-converter.git",
    },
    bugs: {
      url: "https://github.com/abcnews/core-hash-converter/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
