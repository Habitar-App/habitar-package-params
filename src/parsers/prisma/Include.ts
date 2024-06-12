function prismaIncludeParamParser(includes: string[]): Record<string, any> | null {
    if (!includes.length)
        return null;
    
    const object: Record<string, any> = {};
    includes.forEach((include) => {
        let currentObject = object;
        const includeSplitted = addItemBetweenElements(include.split("."), "include");
        includeSplitted.forEach((key) => {
            var _a;
            currentObject[key] = (_a = currentObject[key]) !== null && _a !== void 0 ? _a : {};
            currentObject = currentObject[key];
        });
    });
    convertEmptyObjectsToTrue(object);
    return object;
}

function convertEmptyObjectsToTrue(obj: Record<string, any>): void {
    for (const key in obj) {
        if (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0) {
            obj[key] = true;
        }
        else if (typeof obj[key] === "object") {
            convertEmptyObjectsToTrue(obj[key]);
        }
    }
}

function addItemBetweenElements(array: string[], element: string): string[] {
    const result: string[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i]);
        if (i < array.length - 1) {
            result.push(element);
        }
    }
    return result;
}

export { prismaIncludeParamParser }