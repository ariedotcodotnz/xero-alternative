/*
 * Expects a DOM element with a data-dismiss attribute
 * When clicked, the first parent with a data-dismissable attribute will be hidden
 * and a request is sent to add a dismiss UserEvent to the database
 * Eg.
 * <div data-dismissable>
 *  <button data-dismiss>Dismiss</button>
 * </div>
 * The dismissable data attribute string needs to be allowed in UserEvent::VALID_EVENTS
 * Suggested format is "<type_of_notification><datestamp>_dismissed", eg
 * "au_cards_banner_082023_dismissed"
 */

const animationInitialState = ["tw-opacity-100", "tw-scale-100"];
const animationAfterState = ["tw-opacity-0", "tw-scale-95"];

const sendDismissEvent = async (eventName: string) => {
  const csrfToken: HTMLMetaElement | undefined = document.querySelector(
    "meta[name='csrf-token']",
  );

  if (!csrfToken) {
    if (typeof Rollbar !== "undefined") {
      Rollbar.warning("Unable to send DismissEvent, no CSRF token found");
    }
    return;
  }

  const response = await fetch(
    Routes.user_event_index_path({ event_name: eventName }),
    {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken?.content,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to create DismissEvent, server responded with an error.",
    );
  }
};

export default () => {
  document.addEventListener("click", async (event) => {
    const { target } = event;
    if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
      return;
    }

    const dismissTrigger = target.closest("[data-dismiss]");
    if (!dismissTrigger || !(dismissTrigger instanceof HTMLElement)) {
      return;
    }

    const dismissable = target.closest("[data-dismissable]");

    // We'll assume this is correctly set up, so we don't need to check for it
    if (dismissable) {
      event.preventDefault();

      dismissable.classList.add(
        "tw-transition-all",
        ...animationInitialState,
        ...animationAfterState,
      );
      dismissable.classList.remove(...animationInitialState);

      dismissable.addEventListener("transitionend", () => {
        dismissable.classList.add("-tw-translate-y-full");
        setTimeout(() => {
          dismissable.remove();
        }, 300);
      });

      try {
        await sendDismissEvent(dismissTrigger.dataset.dismiss);
      } catch (error) {
        if (typeof Rollbar !== "undefined") {
          Rollbar.error(error);
        }
      }
    }
  });
};
