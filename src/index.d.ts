import { Plugin } from "vite";

declare interface ParseFromPrePublicOptions {
  files: string[];
}

declare function parseFromPrePublic(options: ParseFromPrePublicOptions): Plugin;

export { parseFromPrePublic };
