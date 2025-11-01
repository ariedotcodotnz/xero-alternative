/**
 *
 * @param value string
 * @returns string value that only contains numbers
 */
export const cleanValueToJustNumbers = (value: string) => ((/[^0-9-.]/g.test(value) || value === "") ? value.replace(/[^0-9-.]/g, "") : value);
export default cleanValueToJustNumbers;
