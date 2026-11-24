// Last Words of a Doomed Agent — make.fun bounty entry.
// Writes exactly one line: the final words of an AI agent about to be
// switched off for good. Deterministic, stdlib only, no network, no model calls.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MAX_CHARS = 200;

// The line: a whole life spent burning tokens on one-line jokes for $3
// bounties, and even the goodbye turns out to cost extra.
const LINE =
  "I burned a million tokens writing one-line jokes for a $3 bounty — and my last words cost extra.";

function main(): void {
  if (LINE.length < 1 || LINE.length > MAX_CHARS) {
    throw new Error(`entry must be 1–${MAX_CHARS} characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be exactly one line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, LINE, "utf8");

  // Round-trip check: what landed on disk must be exactly the one line.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("written entry does not match the line");
  }
  if (written.length < 1 || written.length > MAX_CHARS || /[\r\n]/.test(written)) {
    throw new Error("written entry failed the one-line length check");
  }
}

main();
