import { splitByDots } from "@/utils/splitByDots";

interface PrismaSearchParamParserOptions {
  fullText?: boolean;
}

function prismaSearchParamParser(
  search: string,
  validFields: string[],
  options?: PrismaSearchParamParserOptions
): Record<string, any> | { OR: undefined } {
  if (!search || !validFields || validFields.length === 0) {
    return { OR: undefined };
  }

  const searchParam: { OR: Array<Record<string, any>> } = { OR: [] };

  if (options?.fullText) {
    const searchValue = search
      .split(" ")
      .filter((term) => term.trim() !== "")
      .join("|");

    validFields.forEach((field) => {
      searchParam.OR.push(
        splitByDots(field, { search: searchValue })
      );
    });
  } else {
    validFields.forEach((field) => {
      searchParam.OR.push(
        splitByDots(field, { contains: search, mode: "insensitive" })
      );
    });
  }
  return searchParam;
}

export { prismaSearchParamParser };
