function logMessage(message: string) {
  const pluginLabel = "\x1b[38;5;45m\x1b[1m[plugin-pre-public]\x1b[0m";
  console.log(`${pluginLabel} ${message}`);
}

export { logMessage };
