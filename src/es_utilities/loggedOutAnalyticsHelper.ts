/*
 * When the user is not logged in we don't want to send analytics events
 * Here we set a payload to be sent when analytics becomes available and
 * a valid user ID can be used for identifying
 * A single key is used and is overwritten if a new entry is added.
 */

const KEY = "pendingAnalyticsEvents";

interface AnalyticsEvent {
  name: string;
  attributes: {
    origin_platform: string;
  };
}
const loggedOutAnalyticsHelper = () => {
  document.addEventListener("turbolinks:load", () => {
    if (document.querySelector("body.hnry-auth.sessions")) {
      const event: AnalyticsEvent = {
        name: "user_login_successful",
        attributes: {
          origin_platform: document.userPlatform,
        },
      };
      sessionStorage.setItem(KEY, JSON.stringify(event));
    }

    if (document.querySelector("body.hnry-auth.signup")) {
      const event: AnalyticsEvent = {
        name: "user_signup_successful",
        attributes: {
          origin_platform: document.userPlatform,
        },
      };
      sessionStorage.setItem(KEY, JSON.stringify(event));
    }
  });
};

export default loggedOutAnalyticsHelper;
