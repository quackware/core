import * as StringUtils from "../string-utils.ts";
import { assertEquals, assertObjectMatch } from "./test-deps.ts";

Deno.test("string-utils", async (t) => {
  await t.step("kebabCase", () => {
    assertEquals(StringUtils.kebabCase("fooBarBaz"), "foo-bar-baz");

    assertEquals(StringUtils.kebabCase("foofoofoo"), "foofoofoo");

    assertEquals(StringUtils.kebabCase("BarBarBaz"), "bar-bar-baz");

    assertEquals(StringUtils.kebabCase("lo_dashBarBaz"), "lo-dash-bar-baz");
  });

  await t.step("interpolate", () => {
    const res = StringUtils.interpolate(
      `My Name Is {{name}}, I'm {{wow_look_at_me}} years old`,
      {
        name: "curtis",
        wow_look_at_me: "22",
      },
    );

    assertEquals(res, "My Name Is curtis, I'm 22 years old");
  });

  await t.step("replace", () => {
    const toReplaceVal = "The variable is ${ENV_VAR} with extra ${ENV_VAR}" as const;
    const replaced = StringUtils.replace(
      toReplaceVal,
      "${ENV_VAR}",
      "Coolbeans",
      true,
    );
    assertEquals(replaced, "The variable is Coolbeans with extra Coolbeans");
  });

  await t.step("eatWhitespace includeEscapeSequences", () => {
    const jsonString = `      "result": {
      "kind": "or",
      "items": [
        {
          "kind": "reference",
          "name": "Definition"
        },
        {
          "kind": "array",
          "element": {
            "kind": "reference",
            "name": "DefinitionLink"
          }
        },
        {
          "kind": "base",
          "name": "null"
        }
      ]
    }`;

    // NOTE: This is kinda broken
    const omnom = StringUtils.replace(jsonString, "\n", "", true);
    const seconded = StringUtils.replace(omnom, " ", "", true);
  });

  await t.step("camelCaseProperties", () => {
    const props = {
      BIG_WORDS: "are cool",
    };

    const cameled = StringUtils.camelCaseProperties(props);
    assertObjectMatch(cameled, { bigWords: "are cool" });
  });

  await t.step("kebabCaseProperties", () => {
    const props = {
      bigWords: "are cool",
    };

    const kebabed = StringUtils.kebabCasePropertes(props);
    assertObjectMatch(kebabed, { "big-words": "are cool" });
  });

  await t.step("snakeCaseProperties", () => {
    const props = {
      bigWords: "are cool",
    };

    const snaked = StringUtils.snakeCaseProperties(props);
    assertObjectMatch(snaked, { "big_words": "are cool" });
  });
});
