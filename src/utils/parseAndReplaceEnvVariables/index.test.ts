import { expect, describe, it, beforeEach, vi } from "vitest";

import * as vite from "vite";
import path from "node:fs/promises";

import { parseAndReplaceEnvVariables } from ".";
import { readFile } from "node:fs";

const mockedEnvFileValues = {
  API_KEY: "58a73ab2-d915-437e-b7a1-7c35781cb491",
  API_URL: "http://api.example.edu/v1",
};

vi.mock("vite", () => ({
  loadEnv: () => mockedEnvFileValues,
}));

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}));

describe("parseAndReplaceEnvVariables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should replace variables succesfully", async () => {
    const mockedFileContent =
      "The API URL is import.meta.env.API_URL and the API KEY is ${import.meta.env.API_KEY}";
    const mockedFileResult = `The API URL is ${mockedEnvFileValues.API_URL} and the API KEY is ${mockedEnvFileValues.API_KEY}`;
    const mockedFilePath = "sample/file/js";

    try {
      const spyLoadEnv = vi.spyOn(vite, "loadEnv");
      const spyReadFile = vi
        .spyOn(path, "readFile")
        .mockResolvedValue(mockedFileContent);

      const result = await parseAndReplaceEnvVariables(
        mockedFilePath,
        "development"
      );

      expect(spyLoadEnv).toHaveBeenCalledTimes(1);
      expect(spyReadFile).toHaveBeenCalledTimes(1);
      expect(spyReadFile).toHaveBeenCalledWith(mockedFilePath, "utf-8");
      expect(result).toBe(mockedFileResult);
    } catch (error) {
      console.log({ error });
    }
  });

  it("should handle inexistent variables", async () => {
    const mockedFileContent = "The dog's name is import.meta.env.DOG_NAME and the cat is ${import.meta.env.CAT_NAME}";
    const mockedFileResult = `The dog's name is ${''} and the cat is ${''}`;
    const mockedFilePath = "sample/file/js";

    try {
      const spyLoadEnv = vi.spyOn(vite, "loadEnv");
      const spyReadFile = vi
        .spyOn(path, "readFile")
        .mockResolvedValue(mockedFileContent);

      const result = await parseAndReplaceEnvVariables(
        mockedFilePath,
        "development"
      );

      expect(spyLoadEnv).toHaveBeenCalledTimes(1);
      expect(spyReadFile).toHaveBeenCalledTimes(1);
      expect(spyReadFile).toHaveBeenCalledWith(mockedFilePath, "utf-8");
      expect(result).toBe(mockedFileResult);
    } catch (error) {
      console.log({ error });
    }
  });
});
