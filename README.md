# vite-plugin-pre-public

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
![Automated Tests](https://github.com/rafaelcavalcante/vite-plugin-pre-public/actions/workflows/test.yml/badge.svg?branch=main)
![Downloads](https://img.shields.io/npm/dm/vite-plugin-pre-public.svg)

This plugin enables you to parse environment variables in files that need to be used through the public folder.

## Usage

### Step one: Set-up your files

Add the files you need to have the environment variables parsed inside a folder called `pre-public` in the root folder. For example, you may have the following file inside your pre-public folder:

```js
(function () {
  console.log(`${import.meta.env.VITE_EXAMPLE}`);
})();
```

Make sure your have the right environment variable in your .env file:

```
VITE_EXAMPLE=Hello, world!
```

### Step two: Add the plugin to your Vite configuration file

Add `parseFromPrePublic` plugin to `vite.config.js` (or `vite.config.ts`) file:

```js
import { parseFromPrePublic } from "vite-plugin-pre-public";

export default {
  plugins: [
    parseFromPrePublic({
      files: ["example.js"], // path/pre-public/example.js
    }),
  ],
};
```

### Step three: Use your files!

The plugin will generate an `example.js` file inside your `public` folder with the following content:

```js
(function () {
  console.log(`Hello, world!`);
})();
```
