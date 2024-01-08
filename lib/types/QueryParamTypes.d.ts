export type QueryParamOperators = ">" | ">=" | "<" | "<=" | "=" | "!=" | "~";
export type PrismaParamOperators = "gt" | "gte" | "lt" | "lte" | "equals" | "not" | "contains";
export type QueryParamsType = [string, QueryParamOperators, string | boolean | number];
