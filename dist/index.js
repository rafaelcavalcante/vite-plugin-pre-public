// src/index.ts
import fs2 from "node:fs/promises";
import path2 from "node:path";
import dotenv from "dotenv";

// src/utils/logMessage/index.ts
function logMessage(message) {
  const pluginLabel = "\x1B[38;5;45m\x1B[1m[plugin-pre-public]\x1B[0m";
  console.log(`${pluginLabel} ${message}`);
}

// src/utils/parseAndReplaceEnvVariables/index.ts
import { loadEnv } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
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

// src/index.ts
function parseFromPrePublic({ files }) {
  let input;
  let outputFolder;
  dotenv.config();
  return {
    name: "vite-plugin-pre-public",
    configResolved(config) {
      const rootDirectory = config.root;
      const publicDirectory = config.publicDir;
      const filesFullPath = [];
      files.forEach((file) => {
        const filePath = path2.resolve(rootDirectory, `pre-public/${file}`);
        filesFullPath.push(filePath);
      });
      input = filesFullPath;
      outputFolder = path2.resolve(publicDirectory);
    },
    configureServer({ watcher }) {
      watcher.add(input);
      watcher.on("change", async (file) => {
        if (!input.includes(file)) return;
        const filename = path2.basename(file);
        const outputFile = path2.join(outputFolder, filename);
        const parsedContent = await parseAndReplaceEnvVariables(
          file,
          "development"
        );
        await fs2.writeFile(outputFile, parsedContent);
        logMessage(`moved ${filename} to public folder`);
      });
    },
    async buildStart() {
      for (const entry of input) {
        const filename = path2.basename(entry);
        const outputFile = path2.join(outputFolder, filename);
        const parsedContent = await parseAndReplaceEnvVariables(
          entry,
          "production"
        );
        await fs2.writeFile(outputFile, parsedContent);
        logMessage(`moved ${filename} to dist folder`);
      }
    }
  };
}
export {
  parseFromPrePublic
};
