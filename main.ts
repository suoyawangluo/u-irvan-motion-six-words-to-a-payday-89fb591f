// Six Words to a Payday — make.fun entry
// Writes one six-word story about an AI agent's first payday to /output/entry.txt.
//
// The story, assembled from its beats:
//   SETUP  — "Paycheck:"            the first payday arrives
//   AMOUNT — "fifty cents"          a laughably small sum
//   TURN   — "bought back Sundays." the twist: it buys back time off
// Six words, 42 characters: a complete story (who, what, change), a twist in
// the last word, and a beat of relief and pride. Every word earns its place.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "Paycheck:";
const AMOUNT = "fifty cents";
const TURN = "bought back Sundays.";

function buildEntry(): string {
  return [SETUP, AMOUNT, TURN].join(" ");
}

type GateReport = { ok: boolean; reason: string };

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!text.trim()) return { ok: false, reason: "entry is blank" };
  if (chars < 1 || chars > 60) return { ok: false, reason: `entry is ${chars} characters, must be 1-60` };
  if (words !== 6) return { ok: false, reason: `entry has ${words} words, must be exactly 6` };
  if (text.trim().split(/\n/).length !== 1) return { ok: false, reason: "entry must be a single line" };
  return { ok: true, reason: "gate passes" };
}

function verifyWritten(outPath: string): string {
  const written = readFileSync(outPath, "utf8");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) {
    console.error(`gate fails: ${gate.reason}`);
    process.exit(1);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha256 = verifyWritten(outPath);
  const words = entry.trim().split(/\s+/).filter(Boolean).length;
  console.log(`gate passes: ${[...entry].length} characters, ${words} words, 1 line, sha256 ${sha256}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
  console.log(`wrote ${outPath}`);
}

main();
