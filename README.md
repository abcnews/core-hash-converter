# core-hash-converter

Converts a CoreMedia #hashstring into a config object using all available characters.

Current characters supported, as per [html4](https://www.w3.org/TR/html4/types.html) spec:

> ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("\_"), colons (":"), and periods (".")

Or as a [regex](https://regexr.com/):

```regex
/^[a-z]+[a-z0-9\-_:\.]*$/i
```

So you can parse strings like:

```
"stringOne:Hello_numberOne:5_lat:-32.3_lng:-141.55_isSomething:true"
```

And they turn into JavaScript objects:

```js
{
  stringOne: "Hello",
  numberOne: 5,
  lat: -32.3,
  lng: -141.55,
  isSomething: true,
}
```

## Installation

On [JSR](https://jsr.io/@abcnews/core-hash-converter):

```bash
# deno, pnpm 10.9+, and yarn 4.9+ with first class JSR support
deno add jsr:@abcnews/core-hash-converter
pnpm add jsr:@abcnews/core-hash-converter
yarn add jsr:@abcnews/core-hash-converter

# npm, bun, and older versions of yarn or pnpm
npx jsr add @abcnews/core-hash-converter
bunx jsr add @abcnews/core-hash-converter
yarn dlx jsr add @abcnews/core-hash-converter
pnpm dlx jsr add @abcnews/core-hash-converter
```

Or [NPM](https://www.npmjs.com/package/@abcnews/core-hash-converter):

```bash
npm install @abcnews/core-hash-converter
```

## Usage

```js
import { parse } from "@abcnews/core-hash-converter";

const config = parse(
  "stringOne:Hello_numberOne:5_lat:-32.3_lng:-141.55_isSomething:true_nothing:null",
);

console.log(config);
```

## Development

Build for NPM with `deno task build-npm 0.1.3` (replacing the version with your version number).

## Notes

This tool is meant for use with ABC News Digital CSM CoreMedia, but could be helpful for others to use too.
