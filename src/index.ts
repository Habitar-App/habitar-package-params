import {
  includeParamParser,
  queryParamParser,
  sortParamParser,
} from "@/parsers/butfly";
import {
  prismaIncludeParamParser,
  prismaQueryParser,
  prismaSearchParamParser,
} from "@/parsers/prisma";

import { QueryParamOperators, QueryParamsType } from "@/types/QueryParamTypes";

export default {
  includeParamParser,
  queryParamParser,
  sortParamParser,
  prismaIncludeParamParser,
  prismaQueryParser,
  prismaSearchParamParser,
};
export type { QueryParamOperators, QueryParamsType };
