import * as butflyParsers from "@/parsers/butfly";
import * as prismaParsers from "@/parsers/prisma";

import { QueryParamOperators, QueryParamsType } from "@/types/QueryParamTypes";

export default {
  includeParamParser: butflyParsers.includeParamParser,
  operatorsParamParser: butflyParsers.operatorsParamParser,
  sortParamParser: butflyParsers.sortParamParser,

  prismaIncludeParamParser: prismaParsers.prismaIncludeParamParser,
  prismaOperatorsParser: prismaParsers.prismaOperatorsParser,
  prismaSearchParamParser: prismaParsers.prismaSearchParamParser,
};

export type { QueryParamOperators, QueryParamsType };
