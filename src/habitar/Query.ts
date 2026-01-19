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
      const operatorMatch = field.match(
        /^(.*?)(>=|<=|!=|!~|><|>|<|~|=|@)(.*)$/
      );

      if (!operatorMatch) throw new Error("Operator was not found");
      const [, , operator, rawValue] = operatorMatch;

      if (!operator) throw new Error("Invalid query param");
      if (
        rawValue.match(/^(>=|<=|!=|!~|><|>|<|~|=|@)/)
      ) {
        throw new Error("You must provide only one operator");
      }

      let key;
      let value: any;

      if (operator === "@") {
        const atIndex = field.indexOf("@");
        key = field.slice(0, atIndex);
        value = field
          .slice(atIndex + 1)
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
        const operatorIndex = field.indexOf(operator);
        key = field.slice(0, operatorIndex);
        value = field.slice(operatorIndex + operator.length);
      }

      if (fieldsConfigs?.length) {
        for (const config of fieldsConfigs) {
          if (config.field === key) {
            if (config.type === "number") {
              if (operator === "><") {
                value = value.map((v: string) => Number(v));
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
