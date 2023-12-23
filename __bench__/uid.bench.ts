import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import uid from "../uid.ts";

Deno.bench({
  name: "uid 11",
  fn: () => {
    const id = uid();
    assertEquals(id.length, 11);
  },
});

Deno.bench({
  name: "uid 8",
  fn: () => {
    const id = uid(8);
    assertEquals(id.length, 8);
  },
});

Deno.bench({
  name: "uid 16",
  fn: () => {
    const id = uid(16);
    assertEquals(id.length, 16);
  },
});

Deno.bench({
  name: "uid 36",
  fn: () => {
    const id = uid(36);
    assertEquals(id.length, 36);
  },
});

Deno.bench({
  name: "crypto.randomUuid()",
  fn: () => {
    const id = crypto.randomUUID();
    assertEquals(id.length, 36);
  },
});

Deno.bench({
  name: "crypto.randomUuid().slice(0, 8)",
  fn: () => {
    const id = crypto.randomUUID().slice(0, 8);
    assertEquals(id.length, 8);
  },
});
