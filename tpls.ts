/**
 * An ES6 string tag that strips indentation from multi-line strings.
 *
 * @example
 *
 * ```js
 * import dedent from "dedent";
 *
 * function usageExample() {
 *   const first = dedent`A string that gets so long you need to break it over
 *                        multiple lines. Luckily dedent is here to keep it
 *                        readable without lots of spaces ending up in the string
 *                        itself.`;
 *
 *   const second = dedent`
 *     Leading and trailing lines will be trimmed, so you can write something like
 *     this and have it work as you expect:
 *
 *       * how convenient it is
 *       * that I can use an indented list
 *          - and still have it do the right thing
 *
 *     That's all.
 *   `;
 *
 *   const third = dedent(`
 *     Wait! I lied. Dedent can also be used as a function.
 *   `);
 *
 *   return first + "\n\n" + second + "\n\n" + third;
 * }
 * ```
 *
 * ```js
 * > console.log(usageExample());
 * ```
 *
 * ```sh
 * A string that gets so long you need to break it over
 * multiple lines. Luckily dedent is here to keep it
 * readable without lots of spaces ending up in the string
 * itself.
 *
 * Leading and trailing lines will be trimmed, so you can write something like
 * this and have it work as you expect:
 *
 *   * how convenient it is
 *   * that I can use an indented list
 *     - and still have it do the right thing
 *
 * That's all.
 *
 * Wait! I lied. Dedent can also be used as a function.
 * ```
 */
export function dedent(
  strings: TemplateStringsArray,
  ...values: Array<string>
) {
  const raw = strings.raw;

  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`");

    if (i < values.length) {
      result += values[i];
    }
  }

  const lines = result.split("\n");
  let mindent: number | null = null;
  lines.forEach((l) => {
    const m = l.match(/^(\s+)\S+/);
    if (m) {
      const indent = m[1].length;
      if (!mindent) {
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    const m = mindent;
    result = lines.map((l) => (l[0] === " " ? l.slice(m) : l)).join("\n");
  }

  return result.trim().replace(/\\n/g, "\n");
}

export function quote(
  pieces: TemplateStringsArray,
  ...args: Array<string | number>
) {
  let parsed = pieces[0];
  let i = 0;
  for (; i < args.length; i++) {
    if (typeof args[i] === "string") {
      parsed += "\"" + args[i] as string + "\"" + pieces[i + 1];
    } else {
      parsed += args[i] + pieces[i + 1];
    }
  }
  for (++i; i < pieces.length; i++) {
    parsed += pieces[i];
  }
  return parsed;
}
