/**
 * Clamps a value to a maximum number.
 *
 * @param value - The value to be clamped.
 * @param max - The maximum number to clamp the value to.
 * @returns The clamped value.
 */
export const clampToMax = (value: number, max: number): number =>
  Math.min(value, max);

/**
 * Clamps a value to a maximum number.
 * If the value is greater than the maximum, it returns the maximum followed by a plus sign.
 * If the value is less than or equal to the maximum, it returns the value itself.
 *
 * @param value - The value to be clamped.
 * @param max - The maximum number to clamp the value to.
 * @returns The clamped value or the maximum followed by a plus sign.
 */
export const friendlyClampToMax = (value: number, max: number): string => {
  const clampedMax = clampToMax(value, max);
  return clampedMax === value ? value.toString() : `${max}+`;
};
