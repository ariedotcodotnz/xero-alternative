import React from "react";
import Icon from "../_atoms/icons/icon/Icon";

interface iCloseToast {
  handler: () => void;
}

const CloseToast = ({ handler }: iCloseToast) => (
  <button
    className="toast-close-button"
    aria-label="Dismiss notification"
    onClick={handler}
  >
    <Icon type="XMarkIcon" classes="!tw-text-gray-700" />
    <span className="tw-sr-only">Dismiss</span>
  </button>
);

export default CloseToast;
