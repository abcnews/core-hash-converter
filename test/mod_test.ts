import { assertEquals } from "@std/assert";
import { parse } from "~/src/mod.ts";

Deno.test("parse - strings", () => {
  assertEquals(parse("stringOne:Hello"), { stringOne: "Hello" });
});

Deno.test("parse - numbers", () => {
  assertEquals(parse("numberOne:5"), { numberOne: 5 });
  assertEquals(parse("lat:-32.3_lng:-141.55"), { lat: -32.3, lng: -141.55 });
});

Deno.test("parse - booleans", () => {
  assertEquals(parse("isSomething:true"), { isSomething: true });
  assertEquals(parse("isSomething:false"), { isSomething: false });
});

Deno.test("parse - null", () => {
  assertEquals(parse("value:null"), { value: null });
});

Deno.test("parse - full example", () => {
  assertEquals(
    parse("stringOne:Hello_numberOne:5_lat:-32.3_lng:-141.55_isSomething:true"),
    {
      stringOne: "Hello",
      numberOne: 5,
      lat: -32.3,
      lng: -141.55,
      isSomething: true,
    },
  );
});

Deno.test("parse - empty string returns empty object", () => {
  assertEquals(parse(""), {});
});

Deno.test("parse - malformed pair (no colon) is skipped", () => {
  assertEquals(parse("validKey:1_malformed_anotherKey:2"), {
    validKey: 1,
    anotherKey: 2,
  });
});

Deno.test("parse - empty string value stays as string", () => {
  assertEquals(parse("key:"), { key: "" });
});

Deno.test("parse - values that stay strings, not numbers", () => {
  assertEquals(parse("value:Infinity"), { value: "Infinity" });
  assertEquals(parse("value:-Infinity"), { value: "-Infinity" });
  assertEquals(parse("value:NaN"), { value: "NaN" });
  assertEquals(parse("value:1e3"), { value: "1e3" });
  assertEquals(parse("value:1E3"), { value: "1E3" });
  assertEquals(parse("value:1e-3"), { value: "1e-3" });
  assertEquals(parse("value:0x10"), { value: "0x10" });
  assertEquals(parse("value:0b101"), { value: "0b101" });
  assertEquals(parse("value:0o17"), { value: "0o17" });
  assertEquals(parse("value:+5"), { value: "+5" });
});

// No underscores allowed in values as they are our delimiter.
// "1_000" splits into "value:1" and "000"; the latter has no colon and is skipped.
Deno.test("parse - underscores in values truncate", () => {
  assertEquals(parse("value:1_000"), { value: 1 });
  assertEquals(parse("name:foo_bar"), { name: "foo" });
});

Deno.test("parse - whitespace is not coerced to zero", () => {
  assertEquals(parse("value: "), { value: " " });
  assertEquals(parse("value:  "), { value: "  " });
  assertEquals(parse("value: 42 "), { value: " 42 " });
});

Deno.test("parse - lone punctuation stays a string", () => {
  assertEquals(parse("value:."), { value: "." });
  assertEquals(parse("value:-"), { value: "-" });
  assertEquals(parse("value:-."), { value: "-." });
});

Deno.test("parse - decimal shapes that do coerce", () => {
  assertEquals(parse("value:0"), { value: 0 });
  // Possibly spicy - assertEquals may drop minus - case
  assertEquals(parse("value:-0"), { value: -0 });
  assertEquals(parse("value:.5"), { value: 0.5 });
  assertEquals(parse("value:-.5"), { value: -0.5 });
  assertEquals(parse("value:5."), { value: 5 });
  assertEquals(parse("value:007"), { value: 7 });
  assertEquals(parse("value:100"), { value: 100 });
});

Deno.test("parse - literals are case sensitive", () => {
  assertEquals(parse("a:True_b:FALSE_c:Null"), {
    a: "True",
    b: "FALSE",
    c: "Null",
  });
});

Deno.test("parse - only the first colon splits", () => {
  assertEquals(parse("time:12:30"), { time: "12:30" });
});

Deno.test("parse - later keys win", () => {
  assertEquals(parse("key:1_key:2"), { key: 2 });
});

Deno.test("parse - empty key is allowed (for some reason)", () => {
  assertEquals(parse(":5"), { "": 5 });
});
