import { camelCase } from "lodash";

const convertSnakeToCamelCase = data => {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(convertSnakeToCamelCase);
  }

  return Object.keys(data).reduce((acc, key) => {
    const camelledKey = camelCase(key);

    acc[camelledKey] = data[key];
    acc[camelledKey] = convertSnakeToCamelCase(acc[camelledKey]);

    return acc;
  }, {});
};

export default convertSnakeToCamelCase;
