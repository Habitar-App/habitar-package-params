import { QueryParamOperators, QueryParamsType } from "@/types/QueryParamTypes";

type ErrorCallback = (errorMessage: string) => void;
type QueryString = string | null;
type ValidFields = string[];

function queryParamParser(
  errorCallback: ErrorCallback,
  queryString: QueryString,
  validFields: ValidFields,
  fieldsConfigs?: { field: string; type: "number" | "string" | "boolean" }[]
): QueryParamsType[] {
  try {
    if (!queryString) return [];
    const search: QueryParamsType[] = [];
    const fields = queryString.replace(/[()]/gi, "").split(";");
    fields.map((field) => {
      const matchOperator = field.match(
        /(>=)|(<=)|(!=)|(!~)|(><)|(>)|(<)|(~)|(=)|(@)/g
      );

      if (!matchOperator) throw new Error("Operator was not found");

      if (matchOperator.length > 1)
        throw new Error("You must provide only one operator");
      const [operator] = matchOperator;

      if (!operator) throw new Error("Invalid query param");

      let key;
      let value: any;

      if (operator === "@") {
        key = field.split("@")[0];
        value = field
          .split("@")[1]
          .replace(/[\[\]]/gi, "")
          .split(",")
          .map((item) => item.trim());
      } else if (operator === "><") {
        key = field.split("><")[0];
        const valueString = field.split("><")[1];
        value = valueString
          .replace(/[\[\]]/gi, "")
          .split(",")
          .map((item) => item.trim());

        if (value.length !== 2) {
          throw new Error("Between operator requires exactly 2 values");
        }
      } else {
        key = field.split(operator)[0];
        value = field.split(operator)[1];
      }

      if (fieldsConfigs?.length) {
        for (const config of fieldsConfigs) {
          if (config.field === key) {
            if (config.type === "number") {
              if (operator === "><") {
                // For between operator, convert both values to numbers
                value = value.map((v: string) => Number(v));
                // Validate that both values are valid numbers
                if (value.some((v: number) => isNaN(v))) {
                  throw new Error("Between operator requires valid numbers");
                }
              } else {
                value = Number(value);
              }
            }
          }
        }
      }

      if (!validFields.includes(key))
        throw new Error(
          "Invalid query param provided, valid fields are: " +
            validFields.join(", ")
        );
      search.push([key, operator as QueryParamOperators, value]);
    });
    return search;
  } catch (error: any) {
    errorCallback(error.message || error);
    return [];
  }
}

export { queryParamParser };
