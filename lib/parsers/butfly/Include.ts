type ErrorCallback = (errorMessage: string) => void;
type IncludeParam = string | null | undefined;
type ValidFields = string[] | null | undefined;

function includeParamParser(errorCallback: ErrorCallback, includeParam: IncludeParam, validFields: ValidFields): string[] | undefined {
    try {
        if (!includeParam)
            return [];
        const fields = includeParam.replace(/[()]/gi, "").split(";");
        fields.map((field) => {
            if (!validFields?.includes(field))
                throw new Error("Invalid query param provided, valid fields are: " + validFields?.join(", "));
        });
        return fields;
    }
    catch (error: any) {
        errorCallback(error.message);
    }
    return undefined;
}

export { includeParamParser }
