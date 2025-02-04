import { splitByDots } from "@/utils/splitByDots";

interface PrismaSearchParamParserOptions {
  fullText?: boolean;
}

function prismaSearchParamParser(
  search: string,
  validFields: string[],
  options?: PrismaSearchParamParserOptions
):
  | Record<string, any>
  | {
      search: string;
      params: { OR: undefined };
    } {
  if (!search || !validFields || validFields.length === 0) {
    return { OR: undefined };
  }

  if (options?.fullText) {
    const searchParam: { params: {OR: Array<Record<string, any>> }, search: string } = {
      params: { OR: [] },
      search: ''
    };
    const searchValue = search
      .split(" ")
      .filter((term) => term.trim() !== "")
      .join("|");

    validFields.forEach((field) => {
      searchParam.params.OR.push(splitByDots(field, { search: searchValue }));
    });
    searchParam.search = searchValue
    return searchParam;
  } else {
    const searchParam: { OR: Array<Record<string, any>> } = { OR: [] };
    validFields.forEach((field) => {
      searchParam.OR.push(
        splitByDots(field, { contains: search, mode: "insensitive" })
      );
    });
    return searchParam;
  }
}

export { prismaSearchParamParser };
