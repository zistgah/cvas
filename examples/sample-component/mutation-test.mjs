/** Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary. */
import { mkdtemp, cp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const root = new URL(".", import.meta.url).pathname;
const temp = await mkdtemp(join(tmpdir(), "cvas-mutant-"));
try {
  await cp(root, temp, { recursive: true });
  const source = join(temp, "component.js");
  const original = await readFile(source, "utf8");
  if (!original.includes("input.value * 2")) throw new Error("Mutation target not found; mutation test must be updated");
  await writeFile(source, original.replace("input.value * 2", "input.value * 3"));
  const run = spawnSync(process.execPath, [join(temp, "test.mjs")], { cwd: temp, encoding: "utf8", timeout: 10000 });
  if (run.status === 0) throw new Error("Test suite failed to detect the deliberate mutant");
  console.log("PASS: test suite rejected deliberate arithmetic mutant");
} finally {
  await rm(temp, { recursive: true, force: true });
}
