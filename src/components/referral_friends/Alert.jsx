import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Icon from "../icon/Icon";

const Alert = ({ message = null }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(message != null);
  }, [message]);

  const handleAlertClose = () => {
    setShow(false);
  };

  return show && message ? (
    <div className="referral-alert">
      <div className="referral-alert__body">
        <Icon
          type={`statuses/${message.iconType || "confirmed"}`}
          className="alert-icon"
        />
        <div className="referral-alert__content">
          <p>{message.text}</p>
          {message.btnText && (
            <button
              onClick={(e) => {
                message.handleClick(e);
              }}
              className="hui-link"
            >
              {message.btnText}
            </button>
          )}
        </div>
      </div>
      <Icon
        type="actions/close"
        onClick={handleAlertClose}
        className="tw-w-9 tw-h-9 tw-p-2 tw-rounded-full referral-alert__close-btn"
        label="Close alert box"
        asButton
      />
    </div>
  ) : null;
};

Alert.propTypes = {
  message: PropTypes.shape({
    iconType: PropTypes.string,
    text: PropTypes.string.isRequired,
    btnText: PropTypes.string,
    handleClick: PropTypes.func,
  }),
};

export default Alert;
