import { QueryParamOperators, QueryParamsType } from "@/index";

type ErrorCallback = (errorMessage: string) => void;
type QueryString = string | null;
type ValidFields = string[];


function operatorsParamParser(errorCallback: ErrorCallback, queryString: QueryString, validFields: ValidFields): QueryParamsType[] {
    try {
        if (!queryString)
            return [];
        const search: QueryParamsType[] = [];
        const fields = queryString.replace(/[()]/gi, "").split(";");
        fields.map((field) => {
            const matchOperator = field.match(/(>=)|(<=)|(!=)|(!~)|(>)|(<)|(~)|(=)|(@)/g);

            if (!matchOperator) throw new Error("Operator was not found");

            if (matchOperator.length > 1) throw new Error("You must provide only one operator");
            const [operator] = matchOperator;

            if (!operator) throw new Error("Invalid query param");
            
            let key;
            let value: any;
            
            if (operator === "@") {
                key = field.split("@")[0];
                value = field.split("@")[1].replace(/[\[\]]/gi, "").split(",").map((item) => item.trim());
            } else {
                key = field.split(operator)[0];
                value = field.split(operator)[1];
            }

            if (!validFields.includes(key))
                throw new Error("Invalid query param provided, valid fields are: " + validFields.join(", "));
            search.push([key, operator as QueryParamOperators, value]);
        });
        return search;
    }
    catch (error: any) {
        errorCallback(error.message);
        return []
    }
}

export { operatorsParamParser };
