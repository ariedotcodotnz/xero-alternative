import { getUserFeatures } from "./user_attributes";

/**
 * Retrieves the feature flags for the current user.
 * @returns {Object} The feature flags array string[].
 */
export const getFeatureFlags = () => getUserFeatures();
/**
 * Check if a feature flag is set for a given user.
 * @param {string} flag The single feature flag to check.
 * @return {boolen} Whether or not the provided flag is set for the user.
 */
export const hasFeatureFlag = (flag?: string): boolean => {
  if (!flag) return false;
  const featureFlags = getUserFeatures();
  return featureFlags.includes(flag);
};

export default getFeatureFlags;
