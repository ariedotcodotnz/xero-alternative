import { post } from "./config/fetch.api";

export const dismissNotification = async (notificationId: string) => {
  post(
    Routes.dismissed_notifications_path(),
    JSON.stringify({ notification: notificationId }),
    "application/json",
  );
};

const dismissNotificationRequests = {
  dismissNotification,
};

export default dismissNotificationRequests;
