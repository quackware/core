import { filterEntries } from "https://deno.land/std@0.210.0/collections/filter_entries.ts";
import { DeepNonNullable } from "https://x.curtis.land/types/ts-essentials.ts";

export function pickBy<Obj extends Record<string, unknown>>(object: Obj) {
  const obj: Record<string, unknown> = {};
  for (const key in object) {
    if (object[key]) {
      obj[key] = object[key];
    }
  }
  return obj;
}

export function removeNullProperties<
  T extends Readonly<Record<string, unknown>>,
>(val: T): DeepNonNullable<T> {
  return filterEntries(val, ([, v]) => v != null) as DeepNonNullable<T>;
}

export { deepmerge as merge } from "./merge.ts";
