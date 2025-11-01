import React from "react";
import Icon from "../_atoms/icons/icon/Icon"

interface iToastIcon {
  type: string;
}

const ToastIcon = ({ type }: iToastIcon) => {
  const getIconName = () => {
    switch (type) {
      case "success":
        return "CheckCircleIcon";
      case "error":
        return "XCircleIcon";
      case "warning":
        return "ExclamationTriangleIcon";
      default:
        return "InformationCircleIcon";
    }
  };

  return (
    <span className="toast-icon-wrapper">
      <Icon type={getIconName()} classes={`toast-icon--${type}`} size="lg" />
    </span>
  );
};

export default ToastIcon;
