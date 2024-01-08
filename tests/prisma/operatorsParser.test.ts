import { describe, expect, it } from "bun:test";
import { prismaOperatorsParser } from "../../lib/parsers/prisma";

describe('prismaOperatorsParser', () => {

  it('should return an empty object for an empty input array', () => {
    expect(prismaOperatorsParser([])).toEqual({});
  });

  it('should correctly parse valid operators', () => {
    const params: any = [
      ["age", ">", 30],
      ["name", "~", "John"],
      ["isActive", "=", true],
      ["score", ">=", 50],
      ["height", "<", 180],
      ["weight", "<=", 75],
      ["status", "!=", "inactive"]
    ];
    const expected = {
      age: { gt: 30 },
      name: { contains: "John" },
      isActive: { equals: true },
      score: { gte: 50 },
      height: { lt: 180 },
      weight: { lte: 75 },
      status: { not: "inactive" }
    };
    expect(prismaOperatorsParser(params)).toEqual(expected);
  });
});
