import React from "react";
import PropTypes from "prop-types";

const Confirmation = ({ handleClick, setConfirmation, selectedText }) => {
  const goBack = (e) => {
    e.preventDefault();
    setConfirmation(false);
  };

  return (
    <div className="tw-flex tw-h-full tw-flex-col tw-justify-between">
      <div className="referral-modal__info">
        <h4 id="referral-friends-modal-title" className="tw-text-gray-900 tw-font-semibold tw-text-lg tw-mt-3">
          {`Send reminder to ${selectedText}`}
        </h4>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 referral-modal__paragraph">
          We’ll send them a reminder and see if they need any help getting
          started, have questions, or would like a call from our expert team
        </p>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 referral-modal__paragraph">
          No-one likes spam 😬 Individual email reminders can only be sent once
          every 2 weeks.
        </p>
      </div>
      <div className="tw-flex tw-justify-between tw-flex-wrap-reverse sm:tw-flex-row">
        <button
          className="hnry-button hnry-button--tertiary tw-mx-2 tw-mt-1 md:tw-mt-0"
          aria-label="Cancel"
          onClick={goBack}
        >
          Cancel
        </button>
        <button
          className="hnry-button hnry-button--primary tw-mx-2 tw-mb-1 md:tw-mb-0"
          aria-label="Send reminder to friends"
          onClick={handleClick}
        >
          Send reminder
        </button>
      </div>
    </div>
  );
};

Confirmation.propTypes = {
  handleClick: PropTypes.func.isRequired,
  setConfirmation: PropTypes.func.isRequired,
  selectedText: PropTypes.string.isRequired,
};

export default Confirmation;
