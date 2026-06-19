# core-hash-converter

Converts a CoreMedia #hashstring into a config object using all available characters.

Current characters supported, as per [html4](https://www.w3.org/TR/html4/types.html) spec:

> ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("\_"), colons (":"), and periods (".")

Or as a [regex](https://regexr.com/):

```
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

## Notes

This tool is meant for use with ABC News Digital CSM CoreMedia, but could be helpful for others to use too.
