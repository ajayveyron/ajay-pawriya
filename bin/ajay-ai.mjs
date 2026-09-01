#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const recordRoots = [join(root, "memories"), join(root, "projects")];
const rootRecordFiles = [join(root, "now.md")];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
    }),
  );
  return nested.flat();
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function titleOf(markdown, file) {
  return markdown.match(/^title:\s*(.+)$/m)?.[1] ?? relative(root, file);
}

function excerpt(markdown, tokens) {
  const words = stripFrontmatter(markdown).replace(/\s+/g, " ").trim().split(" ");
  const match = words.findIndex((word) => tokens.some((token) => word.toLowerCase().includes(token)));
  const start = Math.max(0, match - 12);
  return words.slice(start, start + 34).join(" ") + (words.length > start + 34 ? "…" : "");
}

async function records() {
  const nestedFiles = (
    await Promise.all(recordRoots.map((directory) => markdownFiles(directory)))
  ).flat().filter((file) => !file.endsWith("/README.md"));
  const files = [...nestedFiles, ...rootRecordFiles];

  return Promise.all(
    files.map(async (file) => ({
      file,
      markdown: await readFile(file, "utf8"),
    })),
  );
}

function usage() {
  console.log("Usage:\n  ajay-ai list\n  ajay-ai search <query>");
}

const [command, ...terms] = process.argv.slice(2);
const allRecords = await records();

if (command === "list") {
  for (const record of allRecords) console.log(`${titleOf(record.markdown, record.file)}\t${relative(root, record.file)}`);
  process.exit(0);
}

if (command === "search" && terms.length > 0) {
  const tokens = terms.join(" ").toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) ?? [];
  const ranked = allRecords
    .map((record) => ({ ...record, score: tokens.reduce((sum, token) => sum + (record.markdown.toLowerCase().match(new RegExp(token, "g"))?.length ?? 0), 0) }))
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    console.log("No matching context records.");
    process.exit(0);
  }

  for (const record of ranked) {
    console.log(`\n${titleOf(record.markdown, record.file)} (${relative(root, record.file)})`);
    console.log(excerpt(record.markdown, tokens));
  }
  process.exit(0);
}

usage();
process.exitCode = 1;
