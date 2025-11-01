import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "./_atoms/icons/icon/Icon";

const Tooltip = ({
  text,
  link = "",
  sameWindow = false,
  icon = "question-circle",
  otherClasses = "",
  darkBackground = false,
  buttonText = "",
  newIcon,
  trackClickEvent,
}) => {
  const otherProps = {
    tabIndex: 0,
    "data-trigger": "focus",
    "data-toggle": "tooltip",
    "data-html": "true",
    "data-placement": "top",
    "data-track-click": trackClickEvent
      ? JSON.stringify(trackClickEvent)
      : null,
    "data-original-title": link
      ? `<div class="tooltip-content"><p>${text}</p>
      <a href="${link}" rel="${!sameWindow && "noreferrer"}" target="${
          !sameWindow && "_blank"
        }" class="hover:tw-underline !tw-text-white tw-font-bold">Learn more</a></div>`
      : `<div class="tooltip-content">${text}</div>`,
  };

  if (buttonText) {
    return (
      <a
        className={classNames("tooltip-clickable tooltip-click-event", { [`${otherClasses}`]: otherClasses.length > 0 })}
        {...otherProps}
      >
        {buttonText} <span className={`fa fa-${icon}`} />
      </a>
    );
  }

  return (
    <a
      className={classNames("tooltip-clickable tooltip-click-event", {
        [`fa fa-${icon}`]: newIcon ? null : icon,
        "tooltip-clickable--light": darkBackground,
        [`${otherClasses}`]: otherClasses.length > 0,
      })}
      {...otherProps}
    >
      {newIcon && <Icon type={newIcon} size="sm" />}
      <span className="visually-hidden">Launch tooltip</span>
    </a>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  icon: PropTypes.string,
  darkBackground: PropTypes.bool,
  otherClasses: PropTypes.string,
  sameWindow: PropTypes.bool,
  buttonText: PropTypes.string,
  newIcon: PropTypes.string,
  trackClickEvent: PropTypes.object,
};

export default Tooltip;
