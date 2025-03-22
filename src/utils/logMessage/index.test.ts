import { expect, it, vi, describe } from "vitest";

import { logMessage } from ".";

describe("The logMessage util", () => {
  const spyConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

  it("should log a message succesfully", () => {
    const mockedMessage = "File parsed succesfully";

    logMessage(mockedMessage);

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("[plugin-pre-public]")
    );
    expect(spyConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining(mockedMessage)
    );
  });
});
