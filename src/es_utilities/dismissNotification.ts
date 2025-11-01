import { fadeOut } from "./microAnimationHelpers";
import { dismissNotification as dismissNotificationRequest } from "../API/dismissedNotifications.api";

const dismissNotification = () => {
  document.addEventListener("click", async (event) => {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("dismiss-notification")) return;
    const notificationId = target.dataset.href.replace("#", "");
    const { onSuccessEvent } = target.dataset;

    try {
      await dismissNotificationRequest(notificationId);

      fadeOut(target.parentElement);

      if (onSuccessEvent !== null) {
        const theSuccessEvent = new Event(onSuccessEvent);
        window.dispatchEvent(theSuccessEvent);
      }
    } catch (err) {
      if (window.Rollbar && Rollbar.warning) {
        Rollbar.warning(
          `Failed to dismiss notification with id: ${notificationId}`,
        );
      }
    }
  });
};

export default dismissNotification;
