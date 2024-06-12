import { describe, expect, it } from "bun:test";
import { prismaSearchParamParser } from "../../src/parsers/prisma";

describe('prismaSearchParamParser', () => {
  it('should return { OR: undefined } for empty or null search string', () => {
    expect(prismaSearchParamParser(null as any, ["name", "email"])).toEqual({ OR: undefined });
    expect(prismaSearchParamParser("", ["name", "email"])).toEqual({ OR: undefined });
  });

  it('should return { OR: undefined } for null or undefined valid fields array', () => {
    expect(prismaSearchParamParser("test", null as any)).toEqual({ OR: undefined });
    expect(prismaSearchParamParser("test", undefined as any)).toEqual({ OR: undefined });
  });

  it('should construct a correct search query object for valid inputs', () => {
    const search = "john";
    const validFields = ["name", "email"];
    const expected = {
      OR: [
        { name: { contains: "john", mode: "insensitive" } },
        { email: { contains: "john", mode: "insensitive" } }
      ]
    };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });

  it('should handle empty valid fields array', () => {
    const search = "john";
    const validFields: any = [];
    const expected = { OR: [] };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });
});
