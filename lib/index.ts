import * as butflyParsers from "./parsers/butfly";
import * as prismaParsers from "./parsers/prisma";

export const butfly = {
    includeParamParser: butflyParsers.includeParamParser,
    operatorsParamParser: butflyParsers.operatorsParamParser,
    sortParamParser: butflyParsers.sortParamParser
};

export const prisma = {
    prismaIncludeParamParser: prismaParsers.prismaIncludeParamParser,
    prismaOperatorsParser: prismaParsers.prismaOperatorsParser,
    prismaSearchParamParser: prismaParsers.prismaSearchParamParser
};
