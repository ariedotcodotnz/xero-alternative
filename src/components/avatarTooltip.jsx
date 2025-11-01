import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const AvatarTooltip = ({
  text, avatarPath, otherClasses = "", fallbackText, fallbackColour,
}) => {
  const otherProps = {
    tabIndex: 0,
    "data-trigger": "focus",
    "data-toggle": "tooltip",
    "data-html": "true",
    "data-placement": "top",
    title: text,
  };

  if (avatarPath) {
    return (
      <a
        className={classNames("tooltip-clickable tooltip-click-event", { [`${otherClasses}`]: otherClasses.length > 0 })}
        {...otherProps}
      >
        <img
          src={avatarPath}
          alt="Avatar"
          className={classNames("admin_user", "admin_user__small", "d-inline my-0")}
          width={22}
        />
      </a>
    );
  }

  return (
    <a
      className={classNames("tooltip-clickable tooltip-click-event admin_user_avatar admin_user_avatar__small", { [`${otherClasses}`]: otherClasses.length > 0 })}
      {...otherProps}
      style={{
        backgroundColor: fallbackColour,
      }}
    >
      {fallbackText}
    </a>
  );
};

AvatarTooltip.propTypes = {
  text: PropTypes.string.isRequired,
  avatarPath: PropTypes.string,
  otherClasses: PropTypes.string,
  fallbackText: PropTypes.string.isRequired,
  fallbackColour: PropTypes.string.isRequired,
};

export default AvatarTooltip;
