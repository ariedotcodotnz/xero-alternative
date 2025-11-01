import * as amplitude from "@amplitude/analytics-browser";
import { getEnvironment, getAmplitudeAdminApiKey, getAdminUserId } from "../../admin/utilities/user_attributes";

const AMPLITUDE_API_KEY = getAmplitudeAdminApiKey();

const getAmplitudeInstance = () => {

  const options = {
    minIdLength: 1,
    userId: getAdminUserId(),
    defaultTracking: true
  }

  amplitude.init(AMPLITUDE_API_KEY, options);
  return amplitude
};

const acceptableEnvironments = ["production", "uat", "staging"];
export default () => {
  // If segment is present, we don't want to load amplitude
  if (typeof window.analytics === "object") {
    return;
  }

  if (AMPLITUDE_API_KEY && acceptableEnvironments.includes(getEnvironment())) {
    const amplitudeInstance = getAmplitudeInstance();
    // explose amplitude to the window
    window.amplitude = amplitudeInstance;
  }
};
