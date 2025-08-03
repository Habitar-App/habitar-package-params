function nestedObjectAssign(object: Record<string, any>, path: string[], operator: string, value: any): void {
    let currentField = object;
    path.forEach((part, index) => {
        if (index === path.length - 1) {
            if (!currentField[part]) {
                currentField[part] = {};
            }
            currentField[part][operator] = value;
        } else {
            if (!currentField[part]) {
                currentField[part] = {};
            }
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
        "@": "in",
    };
    const fields: Record<string, any> = {};

    params.forEach(([field, operator, value]) => {
        const fieldParts = field.split(".");
        
        if (operator === "><") {
            const [min, max] = value as [number, number];
            nestedObjectAssign(fields, fieldParts, "gte", min);
            nestedObjectAssign(fields, fieldParts, "lte", max);
        } else {
            const prismaOperator = prismaOperators[operator];
            nestedObjectAssign(fields, fieldParts, prismaOperator, value);
        }
    });

    return fields;
}

export { prismaQueryParser };
