interface PrismaQueryParserOptions {
    listRelations?: string[];
    listRelationOperator?: "some" | "every" | "none";
}

function shouldUseListRelation(parts: string[], index: number, listRelations: string[]): boolean {
    const pathKey = parts.slice(0, index + 1).join(".");
    const partKey = parts[index];
    return listRelations.includes(pathKey) || listRelations.includes(partKey);
}

function nestedObjectAssign(
    object: Record<string, any>,
    path: string[],
    operator: string,
    value: any,
    options?: PrismaQueryParserOptions
): void {
    const listRelations = options?.listRelations ?? [];
    const listRelationOperator = options?.listRelationOperator ?? "some";
    let currentField = object;

    path.forEach((part, index) => {
        if (index === path.length - 1) {
            if (!currentField[part]) currentField[part] = {};
            currentField[part][operator] = value;
            return;
        }

        if (!currentField[part]) currentField[part] = {};

        if (listRelations.length > 0 && shouldUseListRelation(path, index, listRelations)) {
            if (!currentField[part][listRelationOperator]) {
                currentField[part][listRelationOperator] = {};
            }
            currentField = currentField[part][listRelationOperator];
            return;
        }

        currentField = currentField[part];
    });
}

function prismaQueryParser(params: [string, string, any][], options?: PrismaQueryParserOptions): Record<string, any> {
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
            nestedObjectAssign(fields, fieldParts, "gte", min, options);
            nestedObjectAssign(fields, fieldParts, "lte", max, options);
        } else {
            const prismaOperator = prismaOperators[operator];
            nestedObjectAssign(fields, fieldParts, prismaOperator, value, options);
        }
    });

    return fields;
}

export { prismaQueryParser };
