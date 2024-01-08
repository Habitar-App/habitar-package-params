function prismaOperatorsParser(params: [string, string, any][]): Record<string, any> {
    const prismaOperators: Record<string, string> = {
        ">": "gt",
        ">=": "gte",
        "<": "lt",
        "<=": "lte",
        "=": "equals",
        "!=": "not",
        "~": "contains",
    };
    const fields: Record<string, any> = {};
    params.forEach(([field, operator, value]) => {
        const prismaOperator = prismaOperators[operator];
        fields[field] = { [prismaOperator]: value };
    });
    return fields;
}

export { prismaOperatorsParser }