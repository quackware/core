import { async } from "../mod.ts";
import { assertEquals, assertExists } from "./test-deps.ts";

Deno.test("async", async (t) => {
  await t.step("deferred", async () => {
    const deferred = async.deferred<string>();
    assertExists(deferred.then);
    assertExists(deferred.catch);

    assertEquals(deferred.state, "pending");

    deferred.resolve("something");

    const res = await deferred;

    assertEquals(res, "something");
    assertEquals(deferred.state, "fulfilled");
  });
});
