import { describe, afterEach, it, expect, jest } from "bun:test";
import { operatorsParamParser } from "../../src/parsers/butfly";
describe('operatorsParamParser', () => {
  const validFields = ["user", "post", "date"];
  const errorCallback = jest.fn();

  afterEach(() => {
    errorCallback.mockClear();
  });

  it('should return an empty array for null or empty queryString', () => {
    expect(operatorsParamParser(errorCallback, null, validFields)).toEqual([]);
    expect(operatorsParamParser(errorCallback, "", validFields)).toEqual([]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should throw an error if no operator is found', () => {
    operatorsParamParser(errorCallback, "user", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Operator was not found");
  });

  it('should throw an error if more than one operator is provided', () => {
    operatorsParamParser(errorCallback, "user>=<30", validFields);
    expect(errorCallback).toHaveBeenCalledWith("You must provide only one operator");
  });

  it('should throw an error if an invalid field is provided', () => {
    operatorsParamParser(errorCallback, "invalid=30", validFields);
    expect(errorCallback).toHaveBeenCalledWith("Invalid query param provided, valid fields are: user, post, date");
  });

  it('should process valid query strings correctly', () => {
    const result = operatorsParamParser(errorCallback, "user=John;date<=2023-01-01", validFields);
    expect(result).toEqual([["user", "=", "John"], ["date", "<=", "2023-01-01"]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  it('should handle with in operator correctly', () => {
    const result = operatorsParamParser(errorCallback, "user@[John,Michel, Peter , Lucian]", validFields);
    console.log(result)
    expect(result).toEqual([["user", "@", ["John", "Michel", "Peter", "Lucian"]]]);
    expect(errorCallback).not.toHaveBeenCalled();
  });
});
