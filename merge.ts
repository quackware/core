import { deepmergeCustom } from "https://deno.land/x/deepmergets@v4.2.1/dist/deno/index.ts";
export * from "https://deno.land/x/deepmergets@v4.2.1/dist/deno/index.ts";

const deepmergeNoArrayDuplicates = deepmergeCustom({
  enableImplicitDefaultMerging: true,
  mergeArrays: (values, utils) => {
    const merged: unknown[] = utils.defaultMergeFunctions.mergeArrays(values);
    return Array.from(new Set(merged));
  },
});

export { deepmergeNoArrayDuplicates };
