/**

Parse strings like:

"stringOne:Hello_numberOne:5_lat:-32.3_lng:-141.55_isSomething:true"

Into:

```ts
  {
    stringOne: "Hello",
    numberOne: 5,
    lat: -32.3,
    lng: -141.55,
    isSomething: true,
  }
```

Pairs are separated by `_` and keys from values by the first `:`, so values may
contain colons but not underscores.

`"true"`, `"false"` and `"null"` become their literal counterparts, and plain
decimal numbers become numbers. Everything else stays a string, including
`"1e3"`, `"0x10"` and `"Infinity"`.

@module
*/

/** A parsed value: the raw string coerced to a boolean, null, number, or left as a string. */
export type Coerced = boolean | null | number | string;

/**
 * Parses a delimited key-value string into a record of coerced values.
 * Pairs without a `:` are skipped.
 *
 * @param src The string to parse.
 * @returns A record of the parsed keys and coerced values.
 *
 * @example
 * ```ts
 * import { parse } from "@abcnews/core-hash-converter";
 *
 * parse("lat:-32.3_lng:-141.55_label:null");
 * // { lat: -32.3, lng: -141.55, label: null }
 * ```
 */
export function parse(src: string): Record<string, Coerced> {
  return src.split("_").reduce(
    (acc, pair) => {
      const i = pair.indexOf(":");
      if (i === -1) return acc;
      const key = pair.slice(0, i);
      const raw = pair.slice(i + 1);
      return { ...acc, [key]: coerce(raw) };
    },
    {} as Record<string, Coerced>,
  );
}

/** Matches plain decimal numbers only — no exponents, hex, or `Infinity`. */
const DECIMAL = /^-?(?:\d+\.?\d*|\.\d+)$/;

/** Coerce the raw string value into a boolean, null, number, or string */
function coerce(raw: string): Coerced {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null") return null;
  if (DECIMAL.test(raw)) return Number(raw);
  return raw;
}
