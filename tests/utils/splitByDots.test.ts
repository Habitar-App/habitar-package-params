import { splitByDots } from "@/utils/splitByDots";
import { describe, expect, it } from "bun:test";

describe("splitByDots", () => {
  it("should split by dots correctly", () => {
    const result = splitByDots("user.name", { any: "value" });
    expect(result).toEqual({ user: { name: { any: "value" } } });
  });

  it("should not split if no dots are found", () => {
    const result = splitByDots("user", { any: "value" });
    expect(result).toEqual({ user: { any: "value" } });
  });
});
