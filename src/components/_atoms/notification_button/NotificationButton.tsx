import React from "react";
import Icon, { IconType } from "../icons/icon/Icon";
import { friendlyClampToMax } from "../../../es_utilities/clampMax";

interface iNotificationBubble {
  count: number;
  screenReaderBubbleText?: string;
  indicateOnly?: boolean;
}

interface iButton {
  alwaysShow?: boolean;
  count: number;
  iconType?: IconType;
  onClick?: () => void;
  screenReaderActionText?: string;
  trackClick: TrackClick;
}

interface iNotificationButton extends iButton, iNotificationBubble {}

const NotificationBubble = ({
  count,
  screenReaderBubbleText,
  indicateOnly,
}: iNotificationBubble) => {
  const bubbleText = `${count} ${screenReaderBubbleText}`;

  if (indicateOnly) {
    return (
      <div className="tw-absolute tw-top-0 tw-right-0 tw-w-2.5 tw-h-2.5 tw-bg-blue-500 tw-rounded-full tw-translate-x-1/4 -tw-translate-y-1/4">
        <span className="tw-sr-only">{bubbleText}</span>
      </div>
    );
  }

  return (
    <div className="tw-absolute tw-top-0 tw-right-0 tw-text-xs tw-bg-blue-500 tw-text-white tw-px-1.5 tw-py-0.5 tw-translate-x-1/3 -tw-translate-y-1/3 tw-rounded">
      <span aria-hidden={true}>{friendlyClampToMax(count, 9)}</span>
      <span className="tw-sr-only">{bubbleText}</span>
    </div>
  );
};

const NotificationButton = ({
  alwaysShow = false,
  count,
  iconType = "AdjustmentsVerticalIcon",
  indicateOnly = false,
  onClick,
  screenReaderActionText = "Open filter settings",
  screenReaderBubbleText = "applied filters",
  trackClick,
}: iNotificationButton) => (
  <button
    className="hnry-button hnry-button--secondary tw-relative tw-aspect-square !tw-h-10 !tw-px-2 !tw-min-w-0 !tw-w-auto"
    onClick={onClick}
    aria-label={screenReaderActionText}
    title={screenReaderActionText}
    type="button"
    data-track-click={JSON.stringify(trackClick)}
  >
    <span className="tw-sr-only">{screenReaderActionText}</span>

    <Icon type={iconType} classes="!tw-mr-0" />
    {(alwaysShow || count > 0) && (
      <NotificationBubble
        count={count}
        screenReaderBubbleText={screenReaderBubbleText}
        indicateOnly={indicateOnly}
      />
    )}
  </button>
);

export default NotificationButton;
