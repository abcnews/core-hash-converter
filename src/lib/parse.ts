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

Values with leading zeros stay strings too (`"007"`, `"00000066"`), so
zero-padded ids and hex colours survive intact.

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
  const out: Record<string, Coerced> = Object.create(null); // Actual {} (no prototype)

  // "a:1_b:2" becomes ["a:1", "b:2"]
  const splitStrings = src.split("_");

  for (const pair of splitStrings) {
    const separatorIndex = pair.indexOf(":");

    // No colon means this isn't a key-value pair, so skip it
    if (separatorIndex === -1) continue;

    // Only the first colon splits, so values may contain colons
    // Slice string at the index. Return key and rawValue
    const key = pair.slice(0, separatorIndex);
    const rawValue = pair.slice(separatorIndex + 1);

    // Coerce value and write to object
    out[key] = coerce(rawValue);
  }

  return out;
}

/**
 * Matches plain decimal numbers only — no exponents, hex, or `Infinity`.
 * Also, numbers with leading zeroes stay as strings (useful for hex colours).
 */
const DECIMAL = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$|^-?\.\d+$/;

/** Coerce the raw string value into a boolean, null, number, or string */
function coerce(raw: string): Coerced {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null") return null;
  if (DECIMAL.test(raw)) return Number(raw);
  return raw;
}
