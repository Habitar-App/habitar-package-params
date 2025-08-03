export type QueryParamOperators = ">" | ">=" | "<" | "<=" | "=" | "!=" | "~" | "@" | "><";
export type PrismaParamOperators = "gt" | "gte" | "lt" | "lte" | "equals" | "not" | "contains" | "in" | "between";
export type QueryParamsType = [string, QueryParamOperators, string | boolean | number | (string | number)[]];
