import { loadEnv } from "vite";
import fs from "node:fs/promises";
import path from "node:path";

async function parseAndReplaceEnvVariables(filePath: string, mode: string) {
  let fileContent = await fs.readFile(filePath, "utf-8");

  const env = loadEnv(mode, path.resolve(process.cwd()));

  const templateLiteralRegex = /\$\{?\s*import\.meta\.env\.(\w+)\s*\}?/g;
  const nonLiteralRegex = /\bimport\.meta\.env\.(\w+)\b/g;

  fileContent = fileContent.replace(
    templateLiteralRegex,
    (_, variableName) => env[variableName] || ""
  );

  fileContent = fileContent.replace(
    nonLiteralRegex,
    (_, variableName) => env[variableName] || ""
  );

  return fileContent;
}

export { parseAndReplaceEnvVariables };
