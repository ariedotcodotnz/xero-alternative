import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Footer = ({ scheduleDate = "", scheduleTime = "" }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const onClick = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    setIsLoading(true);
  };

  return (
    <div className="tw-flex tw-gap-x-2 sm:tw-flex-row tw-w-full tw-justify-between">
      <button
        type="button"
        className="hnry-button hnry-button--tertiary"
        data-dismiss="modal"
        aria-label="Close"
      >
        Cancel
      </button>
      {scheduleDate && scheduleTime ? (
        <button
          className={classNames("hnry-button hnry-button--primary", {
            "hnry-button--loading": isLoading,
          })}
          type="submit"
          name="schedule"
          value="schedule"
          onClick={onClick}
          data-track-click='{ "eventName": "invoice_schedule_button_clicked" }'
        >
          Schedule
        </button>
      ) : (
        <button
          className={classNames("hnry-button hnry-button--primary", {
            "hnry-button--loading": isLoading,
          })}
          type="submit"
          name="send"
          value="send"
          onClick={onClick}
          data-track-click='{ "eventName": "invoice_send_button_clicked" }'
        >
          Send
        </button>
      )}
    </div>
  );
};

Footer.propTypes = {
  scheduleDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  scheduleTime: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default Footer;
