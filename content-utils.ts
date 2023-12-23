import { dedent } from "./tpls.ts";

export async function hash(data: BufferSource) {
  const hash = await crypto.subtle.digest("BLAKE3", data);

  return new Uint8Array(hash);
}

export function wrapInCodeBlock(content: string, contentType: string) {
  const lang = codeBlock(contentType);

  return dedent`
  \`\`\`${lang}
  ${content}
  \`\`\`
  `;
}

export function codeBlock(contentType: string) {
  return FENCED_CODE_BLOCK_LANGS[contentType] ?? "txt";
}

const FENCED_CODE_BLOCK_LANGS: Record<string, string> = {
  "application/javascript": "js",
  "application/typescript": "ts",
  "application/json": "json",
};
