type ErrorCallback = (errorMessage: string) => void;

type SortParam = string | null | undefined;

type ValidFields = string[] | null | undefined;

function sortParamParser(errorCallback: ErrorCallback, sortParam: SortParam, validFields: ValidFields) {
    try {
        if (!sortParam) return;
        if (!(sortParam?.includes(":")))
            throw new Error("Invalid sort param provided");
        const [field, order] = sortParam.split(":");
        if (!(validFields?.includes(field)))
            throw new Error("Invalid query param provided, valid fields are: " +
                validFields?.join(", "));
        if (order !== "asc" && order !== "desc")
            throw new Error("Invalid sort order, must be asc or desc");
        const fieldSplitted = field.split(".");
        let object: Record<string, any> = {};
        fieldSplitted.reduce((previous, current, currentIndex) => {
            if (currentIndex === fieldSplitted.length - 1)
                return (previous[current] = order);
            return (previous[current] = {});
        }, object);
        return object;
    } catch (error: any) {
        errorCallback(error.message);
    }
}

export { sortParamParser };
