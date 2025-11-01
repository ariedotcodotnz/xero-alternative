function ensureJsonFieldsAreNotEmpty<T>(data: T, keysToCheck: (keyof T)[]): boolean {
  return keysToCheck.every((key) => data[key] !== null && data[key] !== "")
}

export default ensureJsonFieldsAreNotEmpty