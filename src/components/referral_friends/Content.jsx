import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Content = ({ isMobile, children }) => {
  const onScroll = (e) => {
    if (!isMobile) {
      const { scrollTop, scrollHeight } = e.currentTarget;
      const event = new CustomEvent("referralContentScroll", {
        detail: { scrollTop, scrollHeight },
      });

      window.dispatchEvent(event);
    }
  };

  return (
    <div
      className={classNames("referral-modal__content", { "mobile-only": isMobile })}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

Content.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Content;
