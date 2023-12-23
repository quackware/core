import {
  CamelCase,
  CamelCasedProperties,
  DelimiterCasedProperties,
  EatWhitespace,
  Interpolate,
  KebabCase,
  PascalCase,
  Replace,
  SnakeCase,
  Split,
  VarRecord,
} from "./deps.ts";
import { extname } from "./path.ts";
export * from "https://git.quack.id/types/string.ts";

export type {
  CamelCase,
  EatWhitespace,
  Interpolate,
  KebabCase,
  PascalCase,
  Replace,
  SnakeCase,
  Split,
  VarRecord,
};

const wordSeparators =
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
const capital_plus_lower = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD][a-zà-ÿ]/g;
const capitals = /[A-ZÀ-Ý\u00C0-\u00D6\u00D9-\u00DD]+/g;
const spacesRegex = / /g;
const basicCamelRegEx =
  /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
const fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
const allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;

export function isUppercase(char = "") {
  return char.toUpperCase() === char;
}

/**
 * Type safe interpolation function. See also {@link replace}
 *
 * @example
 *
 * const res = interpolate(`My Name Is {{name}}, I'm {{wow_look_at_me}} years old`, {
 *   name: "curtis",
 *   wow_look_at_me: "22",
 * });
 *
 * assertEquals(res, "My name is curtis, I'm 22 years old")
 */
export function interpolate<T extends string, Obj extends VarRecord<T>>(
  str: T,
  vars: Obj,
) {
  return Object.entries(vars).reduce((acc, [key, val]) => {
    acc = acc.replace("{{" + key + "}}", val + "");
    return acc;
  }, str as string) as Interpolate<T, Obj>;
}

export function upperFirst<T extends string>(str: T) {
  if (!str) {
    return "";
  }
  return str[0].toUpperCase() + str.slice(1);
}

export function lowerFirst<T extends string>(str: T) {
  if (!str) {
    return "";
  }
  return str[0].toLocaleLowerCase() + str.slice(1);
}

export function eatWhitespace<T extends string>(str: T) {
  return str.replace(spacesRegex, "") as EatWhitespace<T>;
}

export function pascalCase<T extends string>(str: T) {
  const words = str.split(wordSeparators);
  const len = words.length;
  const mappedWords = new Array(len);
  for (let i = 0; i < len; i++) {
    const word = words[i];
    if (word === "") {
      continue;
    }
    mappedWords[i] = word[0].toUpperCase() + word.slice(1);
  }
  return mappedWords.join("") as PascalCase<T>;
}

export function camelCase<Str extends string>(str: Str) {
  const words = str.split(wordSeparators);
  const len = words.length;
  const mappedWords = new Array(len);
  for (let i = 0; i < len; i++) {
    let word = words[i];
    if (word === "") {
      continue;
    }
    const isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word);
    if (isCamelCase) {
      word = word.replace(
        fourOrMoreConsecutiveCapsRegEx,
        function (match, _, offset) {
          return deCap(match, word.length - offset - match.length == 0);
        },
      );
    }
    let firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] = firstLetter +
      (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join("") as CamelCase<Str>;
}

export function camelCaseProperties<
  S extends string,
  T extends Record<S, unknown>,
>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [camelCase(k), v]),
  ) as CamelCasedProperties<T>;
}

function deCap(match: string, endOfWord: boolean) {
  const arr = match.split("");
  const first = arr.shift()!.toUpperCase();
  const last = endOfWord ? arr.pop()!.toLowerCase() : arr.pop();
  return first + arr.join("").toLowerCase() + last;
}

export function snakeCase<T extends string>(str: T) {
  // replace capitals with space + lower case equivalent for later parsing
  const strBuilder = str.replace(capitals, function (match) {
    return " " + (match.toLowerCase() || match);
  });
  return strBuilder.trim().split(wordSeparators).join("_") as SnakeCase<T>;
}

export function snakeCaseProperties<
  S extends string,
  T extends Record<S, unknown>,
>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [snakeCase(k), v]),
  ) as DelimiterCasedProperties<T, "_">;
}

export function kebabCase<T extends string>(str: T) {
  // replace word starts with space + lower case equivalent for later parsing
  // 1) treat cap + lower as start of new word
  let strBuilder = str.replace(capital_plus_lower, function (match) {
    // match is one caps followed by one non-cap
    return " " + (match[0].toLowerCase() || match[0]) + match[1];
  });
  // 2) treat all remaining capitals as words
  strBuilder = strBuilder.replace(capitals, function (match) {
    // match is a series of caps
    return " " + match.toLowerCase();
  });
  return strBuilder.trim().split(wordSeparators).join("-").replace(/^-/, "")
    .replace(/-\s*$/, "") as KebabCase<T>;
}

export function kebabCasePropertes<
  S extends string,
  T extends Record<S, unknown>,
>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [kebabCase(k), v]),
  ) as DelimiterCasedProperties<T, "-">;
}

/**
 * A type safe line split.
 */
export function splitLines<S extends string, SP extends Split<S, "\n">>(
  str: S,
) {
  return str.split("\n") as SP;
}

/**
 * A type safe string split.
 */
export function split<
  S extends string,
  Delim extends string,
  SP extends Split<S, Delim>,
>(str: S, delim: Delim) {
  return str.split(delim) as SP;
}

/**
 * A type safe string replace function
 *
 * @example
 * const target = "aaabbcccbbdd";
 * const searchVal = "bb";
 * const replaceVal = "curtis";
 * // "aaacurtisccccurtisdd"
 * const ret = replace(target, searchVal, replaceVal, true);
 */
export function replace<
  TargetInput extends string,
  SearchValue extends string,
  ReplaceValue extends string,
  All extends true | false,
>(
  target: TargetInput,
  searchValue: SearchValue,
  replaceValue: ReplaceValue,
  all: All,
) {
  if (all === true) {
    return target.replaceAll(searchValue, replaceValue) as Replace<
      TargetInput,
      SearchValue,
      ReplaceValue,
      { all: All }
    >;
  } else {
    return target.replace(searchValue, replaceValue) as Replace<
      TargetInput,
      SearchValue,
      ReplaceValue,
      { all: All }
    >;
  }
}

/**
 * Strip the prefix value from the target value
 */
export function stripPrefix<
  Prefix extends string,
  Target extends `${Prefix}${string}`,
>(
  target: Target,
  prefix: Prefix,
) {
  return replace(target, prefix, "", true);
}

/**
 * Strip the given prefix from the properties of the given object.
 */
export function stripPrefixProperties<
  Obj extends Record<string, string>,
  Prefix extends string,
  Key extends keyof Obj & `${Prefix}${string}`,
>(obj: Obj, prefix: Prefix) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      return [stripPrefix(k as Key, prefix), v] as const;
    }),
  ) as Record<Replace<Key, Prefix, "", { all: true }>, string>;
}

/**
 * Ensure the given path ends in the given extension
 */
export function enforceExtension<
  Path extends string,
  Extension extends `.${string}`,
>(
  path: Path,
  extension: Extension,
): `${string}${Extension}` {
  const ext = extname(path);
  if (ext === extension) {
    return path as `${string}${Extension}`;
  } else {
    return `${path}${extension}` as const;
  }
}

// export function endsWith<Path extends string, Ext extends `.${string}`>(
//   path: Path,
//   ext: Ext,
// ): `${string}${Ext}` {
//   return path.endsWith(ext)
// }
