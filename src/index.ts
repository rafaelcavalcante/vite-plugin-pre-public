import { Plugin } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

import { logMessage } from "./utils/logMessage";
import { parseAndReplaceEnvVariables } from "./utils/parseAndReplaceEnvVariables";

/**
 * Parses files from a pre-publication source and processes them into a plugin.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string[]} params.files - An array of file names with their extensions (e.g., ["example.js", "docs.md"]).
 */
function parseFromPrePublic({ files }: { files: string[] }): Plugin {
  let input: string[];
  let outputFolder: string;

  dotenv.config();

  return {
    name: "vite-plugin-pre-public",

    configResolved(config) {
      const rootDirectory = config.root;
      const publicDirectory = config.publicDir;

      const filesFullPath: string[] = [];

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
    },
  };
}

export { parseFromPrePublic };
