import { index } from "../array.ts";
import { assertSnapshot } from "./test-deps.ts";

Deno.test("array", async (t) => {
  const data = ["one", "two", "three"] as const;

  await t.step("index", async (t) => {
    const indexed = index(data, function idx(t) {
      return t.toString();
    }, function mapper(t) {
      return { type: t };
    });

    await assertSnapshot(t, indexed);
  });
});
