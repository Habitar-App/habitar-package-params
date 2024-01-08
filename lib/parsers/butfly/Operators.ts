import { QueryParamOperators, QueryParamsType } from "../..";

type ErrorCallback = (errorMessage: string) => void;
type QueryString = string | null;
type ValidFields = string[];


function operatorsParamParser(errorCallback: ErrorCallback, queryString: QueryString, validFields: ValidFields): QueryParamsType[] | undefined {
    try {
        if (!queryString)
            return [];
        const search: QueryParamsType[] = [];
        const fields = queryString.replace(/[()]/gi, "").split(";");
        fields.map((field) => {
            const matchOperator = field.match(/(>=)|(<=)|(!=)|(!~)|(>)|(<)|(~)|(=)/g);
            if (!matchOperator)
                throw new Error("Operator was not found");
            if (matchOperator.length > 1)
                throw new Error("You must provide only one operator");
            const [operator] = matchOperator;
            if (!operator)
                throw new Error("Invalid query param");
            const [key, value] = field.split(operator);
            if (!validFields.includes(key))
                throw new Error("Invalid query param provided, valid fields are: " + validFields.join(", "));
            search.push([key, operator as QueryParamOperators, value]);
        });
        return search;
    }
    catch (error: any) {
        errorCallback(error.message);
    }
}

export { operatorsParamParser };
