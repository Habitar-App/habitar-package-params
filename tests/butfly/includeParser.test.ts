import { includeParamParser } from "@/.";
import { describe, expect, it } from "bun:test";

describe("includeParamParser", () => {
  it("should parse data", () => {
    const param = "user;posts.comments";
    const validFields = ["user", "posts.comments"];
    const result = includeParamParser(() => {}, param, validFields);
    expect(result).toEqual(["user", "posts.comments"]);
  });

  it("should parse data with empty param", () => {
    const param = "";
    const validFields = ["user", "posts.comments"];
    const result = includeParamParser(() => {}, param, validFields);
    expect(result).toEqual([]);
  });

  it("should throw error if invalid field is provided", () => {
    const param = "user;posts.comments";
    const validFields = ["user", "posts"];
    const errorCallback = (errorMessage: string) => {
      expect(errorMessage).toEqual("Invalid query param provided, valid fields are: user, posts");
    };
    includeParamParser(errorCallback, param, validFields);
  })
});