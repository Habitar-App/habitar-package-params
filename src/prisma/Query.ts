function nestedObjectAssign(object: Record<string, any>, path: string[], operator: string, value: any): void {
    let currentField = object;
    path.forEach((part, index) => {
        if (index === path.length - 1) {
            currentField[part] = { [operator]: value };
        } else {
            currentField[part] = currentField[part] || {};
            currentField = currentField[part];
        }
    });
}

function prismaQueryParser(params: [string, string, any][]): Record<string, any> {
    const prismaOperators: Record<string, string> = {
        ">": "gt",
        ">=": "gte",
        "<": "lt",
        "<=": "lte",
        "=": "equals",
        "!=": "not",
        "~": "contains",
        "@": "in"
    };
    const fields: Record<string, any> = {};

    params.forEach(([field, operator, value]) => {
        const fieldParts = field.split(".");
        const prismaOperator = prismaOperators[operator];

        nestedObjectAssign(fields, fieldParts, prismaOperator, value);
    });

    return fields;
}

export { prismaQueryParser };
