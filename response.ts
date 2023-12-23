import type { Debug } from "./debug.ts";
import {
  MAX_AGE_1_DAY,
  MAX_AGE_5_MINUTES,
  RedirectCodes,
} from "./response-constants.ts";

function propExists<
  Obj extends object,
  Prop extends PropertyKey,
>(value: Obj, property: Prop): value is Obj & Record<Prop, unknown> {
  return Object.prototype.hasOwnProperty.call(value, property);
}

/**
 * Return the result as a stringified JSON blob. Also sets the response/type
 * and cache-control to 5 minutes if not explicitely set.
 */
export function json(
  data: string | Record<string, unknown> | string[],
  cacheControl?: string,
) {
  const headers: string[][] = [];
  cacheControl ??= MAX_AGE_5_MINUTES;

  headers.push(["cache-control", cacheControl]);
  headers.push(["content-type", "application/json"]);

  if (typeof data !== "string" && propExists(data, "isIncomplete")) {
    headers.push([
      "x-is-incomplete",
      data.isIncomplete === undefined ? "unknown" : "" + data.isIncomplete,
    ]);
  }
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  return new Response(data, {
    headers,
  });
}

export interface TypeScriptOptions {
  /** @default "max-age=86400" */
  cacheControl?: string;

  /** The "X-Typescript-Types" header */
  typescriptTypes?: string;
}
export function ts(data: BodyInit, opts: TypeScriptOptions = {}) {
  const headers: string[][] = [];
  headers.push(["cache-control", opts.cacheControl ??= MAX_AGE_1_DAY]);
  headers.push(["content-type", "application/typescript"]);
  if (opts.typescriptTypes != null) {
    headers.push(["x-typescript-types", opts.typescriptTypes]);
  }

  return new Response(data, {
    headers,
  });
}

export interface JavaScriptOptions {
  /** @default "max-age=86400" */
  cacheControl?: string;

  /** The "X-Typescript-Types" header */
  typescriptTypes?: string;
}
export function js(data: BodyInit, opts: JavaScriptOptions = {}) {
  const headers: string[][] = [];
  headers.push(["cache-control", opts.cacheControl ?? MAX_AGE_1_DAY]);
  headers.push(["content-type", "application/javascript"]);
  if (opts.typescriptTypes != null) {
    headers.push(["x-typescript-types", opts.typescriptTypes]);
  }

  return new Response(data, {
    headers,
  });
}

export function error(errorVal: unknown, log: Debug) {
  if (errorVal instanceof Error) {
    log(`Received error: ${errorVal.message}`);
  } else {
    log(`Received unknown error: ${JSON.stringify(errorVal)}`);
  }

  return fourOhFour();
}

export function fourOhFour() {
  return new Response(null, {
    status: 404,
    statusText: "Not Found",
  });
}

export function hi(msg: string) {
  return new Response(msg, {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
    },
  });
}

export function redirect(to: URL | string, code?: RedirectCodes) {
  return Response.redirect(to.toString(), code);
}
