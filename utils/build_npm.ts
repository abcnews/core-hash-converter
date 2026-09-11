import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

const { version } = JSON.parse(await Deno.readTextFile("./deno.json"));

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@abcnews/core-hash-converter",
    version: version,
    description:
      "A utility for converting strings to objects with various encodings structures.",
    keywords: [
      "parse",
      "parser",
      "hash",
      "querystring",
      "key-value",
      "coerce",
      "typescript",
      "deno",
    ],
    license: "Apache-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/abcnews/core-hash-converter.git",
    },
    bugs: {
      url: "https://github.com/abcnews/core-hash-converter/issues",
    },
  },
  compilerOptions: {
    target: "ES2022",
    lib: ["ESNext"],
  },
  postBuild() {
    Deno.copyFileSync("LICENSE.md", "npm/LICENSE.md");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
