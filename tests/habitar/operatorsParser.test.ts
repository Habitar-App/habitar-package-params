import { describe, afterEach, it, expect, jest } from "bun:test";
import { queryParamParser } from "@/.";
describe("queryParamParser", () => {
  const validFields = ["user", "post", "date", "price", "priceDetails.salePrice", "priceDetails.rentPrice"];
  const errorCallback = jest.fn();

  afterEach(() => {
    errorCallback.mockClear();
  });

  it("should return an empty array for null or empty queryString", () => {
    expect(queryParamParser(errorCallback, null, validFields)).toEqual([]);
    expect(queryParamParser(errorCallback, "", validFields)).toEqual([]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should throw an error if no operator is found", () => {
    queryParamParser(errorCallback, "user", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Operator was not found");
  });

  it("should throw an error if more than one operator is provided", () => {
    queryParamParser(errorCallback, "user>=<30", validFields);
    expect(errorCallback).toHaveBeenCalledWith(
      "You must provide only one operator"
    );
  });

  it("should throw an error if an invalid field is provided", () => {
    queryParamParser(errorCallback, "invalid=30", validFields);
    expect(errorCallback).toHaveBeenCalledWith(
      `Invalid query param provided, valid fields are: ${validFields.join(", ")}`
    );
  });

  it("should process valid query strings correctly", () => {
    const result = queryParamParser(
      errorCallback,
      "user=John;date<=2023-01-01",
      validFields
    );
    expect(result).toEqual([
      ["user", "=", "John"],
      ["date", "<=", "2023-01-01"],
    ]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle with in operator correctly", () => {
    const result = queryParamParser(
      errorCallback,
      "user@[John,Michel, Peter , Lucian]",
      validFields
    );
    console.log(result);
    expect(result).toEqual([
      ["user", "@", ["John", "Michel", "Peter", "Lucian"]],
    ]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle with number values correctly", () => {
    const result = queryParamParser(errorCallback, "price=30", validFields, [{
      field: "price",
      type: "number",
    }]);
    expect(result).toEqual([["price", "=", 30]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle with number values correctly when nested values", () => {
    const result = queryParamParser(
      errorCallback,
      "priceDetails.salePrice=30",
      validFields,
      [{ field: "priceDetails.salePrice", type: "number" }]
    );
    expect(result).toEqual([["priceDetails.salePrice", "=", 30]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle with number values correctly when nested values and multiple fields are provided", () => {
    const result = queryParamParser(
      errorCallback,
      "priceDetails.salePrice=30;priceDetails.rentPrice=30",
      validFields,
      [{ field: "priceDetails.salePrice", type: "number" }, { field: "priceDetails.rentPrice", type: "number" }, ]
    );
    expect(result).toEqual([["priceDetails.salePrice", "=", 30], ["priceDetails.rentPrice", "=", 30]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle between operator correctly with numbers", () => {
    const result = queryParamParser(
      errorCallback,
      "price><[10,50]",
      validFields,
      [{ field: "price", type: "number" }]
    );
    expect(result).toEqual([["price", "><", [10, 50]]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should handle between operator with nested fields", () => {
    const result = queryParamParser(
      errorCallback,
      "priceDetails.salePrice><[100,500]",
      validFields,
      [{ field: "priceDetails.salePrice", type: "number" }]
    );
    expect(result).toEqual([["priceDetails.salePrice", "><", [100, 500]]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it("should throw error when between operator receives less than 2 values", () => {
    queryParamParser(
      errorCallback,
      "price><[10]",
      validFields,
      [{ field: "price", type: "number" }]
    );
    expect(errorCallback).toHaveBeenCalledWith("Between operator requires exactly 2 values");
  });

  it("should throw error when between operator receives more than 2 values", () => {
    queryParamParser(
      errorCallback,
      "price><[10,20,30]",
      validFields,
      [{ field: "price", type: "number" }]
    );
    expect(errorCallback).toHaveBeenCalledWith("Between operator requires exactly 2 values");
  });

  it("should throw error when between operator receives invalid numbers", () => {
    queryParamParser(
      errorCallback,
      "price><[abc,50]",
      validFields,
      [{ field: "price", type: "number" }]
    );
    expect(errorCallback).toHaveBeenCalledWith("Between operator requires valid numbers");
  });

  it("should handle between operator with string values (not configured as number)", () => {
    const result = queryParamParser(
      errorCallback,
      "user><[John,Jane]",
      validFields
    );
    expect(result).toEqual([["user", "><", ["John", "Jane"]]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });
});
