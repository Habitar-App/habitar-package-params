export type QueryParamOperators = ">" | ">=" | "<" | "<=" | "=" | "!=" | "~" | "@";
export type PrismaParamOperators = "gt" | "gte" | "lt" | "lte" | "equals" | "not" | "contains" | "in";
export type QueryParamsType = [string, QueryParamOperators, string | boolean | number | (string | number)[]];
