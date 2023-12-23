/**
 * Create a new object with an index created by the provided {@link indexer}
 */
export function index<T>(
  array: ReadonlyArray<T>,
  indexer: (t: T) => string,
): { [key: string]: T };
export function index<T, R>(
  array: ReadonlyArray<T>,
  indexer: (t: T) => string,
  mapper: (t: T) => R,
): { [key: string]: R };
export function index<T, R>(
  array: ReadonlyArray<T>,
  indexer: (t: T) => string,
  mapper?: (t: T) => R,
): { [key: string]: R } {
  return array.reduce((r, t) => {
    r[indexer(t)] = mapper ? mapper(t) : t;
    return r;
  }, Object.create(null));
}

export { distinctBy } from "https://deno.land/std@0.210.0/collections/distinct_by.ts";
