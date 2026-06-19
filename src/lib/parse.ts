/**

Parse strings like:

"stringOne:Hello_numberOne:5_lat:-32.3_lng:-141.55_isSomething:true"

Into:

```
  {
    stringOne: "Hello",
    numberOne: 5,
    lat: -32.3,
    lng: -141.55,
    isSomething: true,
  }
```

*/

type Coerced = boolean | null | number | string;

/** This function parses the string into a record of key-value pairs */
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

/** Coerce the raw string value into a boolean, null, number, or string */
function coerce(raw: string): Coerced {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null") return null;
  if (raw !== "" && !isNaN(Number(raw))) return Number(raw);
  return raw;
}
