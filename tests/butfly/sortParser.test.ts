import { afterEach, describe, expect, it, jest } from "bun:test";
import { sortParamParser } from "@/.";

describe('sortParamParser', () => {
  const validFields = ["user", "posts", "user.profile", "posts.date"];
  const errorCallback = jest.fn();

  afterEach(() => {
    errorCallback.mockClear();
  });

  it('should return undefined for null or undefined sortParam', () => {
    expect(sortParamParser(errorCallback, null, validFields)).toBeUndefined();
    expect(sortParamParser(errorCallback, undefined, validFields)).toBeUndefined();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should throw error for invalid sort param format', () => {
    sortParamParser(errorCallback, "user", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Invalid sort param provided");
  });

  it('should throw error for invalid field in sort param', () => {
    sortParamParser(errorCallback, "invalid:asc", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Invalid query param provided, valid fields are: user, posts, user.profile, posts.date");
  });

  it('should throw error for invalid sort order', () => {
    sortParamParser(errorCallback, "user:invalid", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Invalid sort order, must be asc or desc");
  });

  it('should handle single-level sort param correctly', () => {
    expect(sortParamParser(errorCallback, "user:asc", validFields)).toEqual({ user: "asc" });
  });

  it('should handle nested sort param correctly', () => {
    expect(sortParamParser(errorCallback, "user.profile:desc", validFields)).toEqual({ user: { profile: "desc" } });
  });
});
