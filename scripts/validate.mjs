import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const memoriesRoot = join(root, "memories");
const required = ["type", "title", "updated", "confidence", "privacy", "sources"];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" ? [path] : [];
    }),
  );
  return nested.flat();
}

const problems = [];
for (const file of await markdownFiles(memoriesRoot)) {
  const markdown = await readFile(file, "utf8");
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  const label = relative(root, file);

  if (!frontmatter) {
    problems.push(`${label}: missing frontmatter`);
    continue;
  }

  const yaml = frontmatter[1];
  for (const key of required) {
    const hasValue = key === "sources" ? /^sources:\n\s+-\s+\S/m.test(yaml) : new RegExp(`^${key}:\\s*\\S`, "m").test(yaml);
    if (!hasValue) problems.push(`${label}: missing ${key}`);
  }
  if (!/^updated:\s*\d{4}-\d{2}-\d{2}$/m.test(yaml)) problems.push(`${label}: updated must use YYYY-MM-DD`);
  if (!/^confidence:\s*(high|medium|low)$/m.test(yaml)) problems.push(`${label}: invalid confidence`);
  if (!/^privacy:\s*(private|restricted)$/m.test(yaml)) problems.push(`${label}: invalid privacy`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Personal context records are valid.");
}
