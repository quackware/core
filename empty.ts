import { isRecord } from "./deps.ts";

export function toUndefinedIfEmpty<T>(obj: T): T | undefined {
  if (!obj) {
    return;
  }
  if (typeof (obj) === "string" && obj === "") return;
  if (Array.isArray(obj) && obj.length === 0) return;
  if (
    isRecord(obj)
    && (Object.keys(obj).length === 0 || Object.values(obj).filter((x) => x).length === 0)
  ) {
    return;
  }
  return obj;
}
