import { snakeCase } from "lodash";

const convertCamelToSnakeCase = data => {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(convertCamelToSnakeCase);
  }

  return Object.keys(data).reduce((acc, key) => {
    const snakedKey = snakeCase(key);

    acc[snakedKey] = data[key];
    acc[snakedKey] = convertCamelToSnakeCase(acc[snakedKey]);

    return acc;
  }, {});
};

export default convertCamelToSnakeCase;
