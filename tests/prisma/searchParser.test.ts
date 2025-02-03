import { describe, expect, it } from "bun:test";
import { prismaSearchParamParser } from "@/.";

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
    const validFields = ["name", "customer.name", "email"];
    const expected = {
      OR: [
        { name: { contains: "john", mode: "insensitive" } },
        { customer: { name: { contains: "john", mode: "insensitive" } } },
        { email: { contains: "john", mode: "insensitive" } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });

  it('should handle empty valid fields array', () => {
    const search = "john";
    const validFields: any = [];
    const expected = { OR: undefined };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });
});

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
    const validFields = ["name", "customer.name", "email"];
    const expected = {
      OR: [
        { name: { contains: "john", mode: "insensitive" } },
        { customer: { name: { contains: "john", mode: "insensitive" } } },
        { email: { contains: "john", mode: "insensitive" } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });

  it('should handle empty valid fields array', () => {
    const search = "john";
    const validFields: any = [];
    const expected = { OR: undefined };
    expect(prismaSearchParamParser(search, validFields)).toEqual(expected);
  });

  // Testes adicionais para full text search
  it('should construct a correct full text search query object for valid inputs with fullText option', () => {
    const search = "cataguases rio";
    const validFields = ["address.city"];
    const expected = {
      OR: [
        { address: { city: { search: "cataguases|rio" } } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields, { fullText: true })).toEqual(expected);
  });

  it('should construct a correct full text search query object for multiple valid fields with fullText option', () => {
    const search = "alpha beta";
    const validFields = ["name", "profile.description"];
    const expected = {
      OR: [
        { name: { search: "alpha|beta" } },
        { profile: { description: { search: "alpha|beta" } } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields, { fullText: true })).toEqual(expected);
  });

  it('should handle extra spaces in search string when using fullText option', () => {
    const search = "   hello    world   ";
    const validFields = ["bio"];
    const expected = {
      OR: [
        { bio: { search: "hello|world" } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields, { fullText: true })).toEqual(expected);
  });

  it('should construct a correct query for fullText search with a single word', () => {
    const search = "singular";
    const validFields = ["description"];
    const expected = {
      OR: [
        { description: { search: "singular" } },
      ]
    };
    expect(prismaSearchParamParser(search, validFields, { fullText: true })).toEqual(expected);
  });
});
