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

// Edge cases worth covering
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
