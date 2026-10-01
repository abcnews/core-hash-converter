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

In a CoreMedia artile you can create a mount point with `#mymount_myNumer:42` and then use [mount-utils](https://github.com/abcnews/mount-utils) to select it with `selectMounts('mymount')` and then parse the `getMountValue` string with `parse(mountValue)`.

## Coercion rules

Values are coerced based on what they look like:

| Value | Becomes | Type |
|-------|---------|------|
| `true` / `false` | `true` / `false` | boolean |
| `null` | `null` | null |
| `5`, `-32.3`, `.5` | `5`, `-32.3`, `0.5` | number |
| everything else | unchanged | string |

Only plain decimal numbers are coerced. These all stay strings:

| Value | Why |
|-------|-----|
| `007`, `00000066` | leading zeros are preserved, so zero-padded ids and hex colours survive |
| `1e3`, `1E3` | exponent notation |
| `0x10`, `0b101`, `0o17` | hex, binary, and octal literals |
| `Infinity`, `NaN` | not plain decimals |
| `+5` | leading plus |
| `5.` | trailing dot |

The literals are case sensitive: `True` and `NULL` stay strings.

## Repeated keys

A key that appears more than once collects its values into an array:

```js
parse("tag:birds_tag:marine_tag:coastal");
// { tag: ["birds", "marine", "coastal"] }
```

A key that appears once is **not** wrapped in an array:

```js
parse("tag:birds");
// { tag: "birds" }
```

Values are not deduplicated, and may be of mixed types.

## Limitations

- **Values cannot contain underscores.** `_` is the pair delimiter, so `value:1_000` parses as `{ value: 1 }` and the `000` is dropped.
- **Values can contain colons.** Only the first `:` in a pair splits key from value, so `time:12:30` gives `{ time: "12:30" }`.
- **Malformed pairs are skipped silently.** A segment with no colon contributes nothing — `inset_40` is simply dropped, with no error.
- **Later keys win.** `key:1_key:2` gives `{ key: 2 }`.

## Development

Pushes to `main` with a new version number will automatically be pushed to JSR.

Build for NPM with `deno task build-npm` (will read your `deno.json` version number).

Then `npm login` with your (ABC approved) NPM account and `npm publish --access public` to publish.

## Notes

This tool is meant for use with ABC News Digital CMS CoreMedia, but could be helpful for others to use too.
