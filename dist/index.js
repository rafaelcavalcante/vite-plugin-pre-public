// src/index.ts
import { loadEnv } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
function parseFromPrePublic({ files }) {
  let input;
  let outputFolder;
  dotenv.config();
  function logMessage(message) {
    const pluginLabel = "\x1B[38;5;45m\x1B[1m[plugin-pre-public]\x1B[0m";
    console.log(`${pluginLabel} ${message}`);
  }
  async function parseAndReplaceEnvVariables(filePath, mode) {
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
  return {
    name: "vite-plugin-pre-public",
    configResolved(config) {
      const rootDirectory = config.root;
      const publicDirectory = config.publicDir;
      const filesFullPath = [];
      files.forEach((file) => {
        const filePath = path.resolve(rootDirectory, `pre-public/${file}`);
        filesFullPath.push(filePath);
      });
      input = filesFullPath;
      outputFolder = path.resolve(publicDirectory);
    },
    configureServer({ watcher }) {
      watcher.add(input);
      watcher.on("change", async (file) => {
        if (!input.includes(file)) return;
        const filename = path.basename(file);
        const outputFile = path.join(outputFolder, filename);
        const parsedContent = await parseAndReplaceEnvVariables(
          file,
          "development"
        );
        await fs.writeFile(outputFile, parsedContent);
        logMessage(`moved ${filename} to public folder`);
      });
    },
    async buildStart() {
      for (const entry of input) {
        const filename = path.basename(entry);
        const outputFile = path.join(outputFolder, filename);
        const parsedContent = await parseAndReplaceEnvVariables(
          entry,
          "production"
        );
        await fs.writeFile(outputFile, parsedContent);
        logMessage(`moved ${filename} to dist folder`);
      }
    }
  };
}
export {
  parseFromPrePublic
};
