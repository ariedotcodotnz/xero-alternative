export interface iValidationParams {
  value: string;
  regex: string | RegExp;
  canBeEmpty: boolean;
  stripWhitespace?: boolean;
}

const isValidInputNumber = ({
  value,
  regex,
  canBeEmpty,
  stripWhitespace = true,
}: iValidationParams): boolean => {
  if (typeof regex === "string") {
    regex = new RegExp(regex);
  }

  if (stripWhitespace) {
    value = value.replace(/\s+/g, "");
  }

  return regex.test(value) || (canBeEmpty && value.length === 0);
};

export default isValidInputNumber;
