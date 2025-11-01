import {
  getDatadogApplicationId,
  getDatadogClientToken,
  getEnvironment,
  getUserEmail,
  getUserFullName,
  getUserId,
  getVersion,
} from "./utilities/user_attributes";

const suppressStrings = [
  "localStorage may be unavailable",
  "localStorage may be full",
  "Script error.",
  "Object Not Found Matching Id",
];

const envReady = () => !!(getEnvironment() && getDatadogClientToken());

if (envReady()) {
  import("@datadog/browser-logs").then((ddLogModule) => {
    const { datadogLogs } = ddLogModule;
    datadogLogs.init({
      clientToken: getDatadogClientToken(),
      site: "datadoghq.com",
      service: "hnry:frontend",
      env: getEnvironment(),
      version: getVersion() || null,
      forwardErrorsToLogs: true,
      forwardConsoleLogs: ["warn", "error"],
      forwardReports: "all",
      sessionSampleRate: 100,
      beforeSend: (event) =>
        !suppressStrings.some((str) => event.message.includes(str)),
    });
  });
}

if (envReady() && getDatadogApplicationId()) {
  // In future, there's opportunity to not load this if we know a user cannot be tracked due to OneTrust or similar
  // This would be a good performance optimisation as the RUM SDK is quite large
  import("@datadog/browser-rum").then((ddRUMModule) => {
    const { datadogRum } = ddRUMModule;
    datadogRum.init({
      applicationId: getDatadogApplicationId(),
      clientToken: getDatadogClientToken(),
      site: "datadoghq.com",
      service: "hnry:frontend",
      env: window.Hnry.Config.environment,
      version: getVersion() || null,
      sessionSampleRate: 5,
      sessionReplaySampleRate: 0,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "mask-user-input",
    });

    const setRUMUser = () => {
      // Return early if no user info present or it has already been set
      if (!getUserId() || datadogRum.getUser()?.id) return;

      document.removeEventListener("turbolinks:load", setRUMUser);

      datadogRum.setUser({
        id: getUserId()?.toString(),
        name: getUserFullName(),
        email: getUserEmail(),
      });
    };

    // Load RUM on Turbolinks page changes in case it was not loaded on initial page load
    document.addEventListener("turbolinks:load", setRUMUser);

    // Load RUM on initial page load
    setRUMUser();
  });
}
