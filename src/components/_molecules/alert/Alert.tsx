import React, { useState } from "react";
import Icon from "@hui/_atoms/icons/icon/Icon";

export type AlertVariant = "info" | "warning" | "success" | "danger";
export type AlertProps = {
  /**
   * The component comes with different background colours and has the following options:
   */
  variant?: AlertVariant;
  /**
   * The content of the alert
   */
  children: React.ReactNode | string;
  /**
   * Render the icon on the left? By default, alert will render with icon. To hide icon, includes includesIcon={false} as prop
   */
  includesIcon?: boolean;
  /**
   * Close button, false by default
   */
  dismissible?: boolean;
  /**
   * (Optional) The title of the alert
   */
  title?: string;
};

const iconType = (variant: AlertVariant) => {
  switch (variant) {
    case "success":
      return "CheckCircleIcon";
    case "danger":
      return "XCircleIcon";
    case "warning":
      return "ExclamationTriangleIcon";
    default:
      return "InformationCircleIcon";
  }
};

const Alert = ({
  includesIcon = true,
  variant = "info",
  children,
  dismissible = false,
  title = "",
}: AlertProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  const hideAlert = () => {
    setShowAlert(false);
  };

  return showAlert ? (
    <div className={`hui-alert hui-alert--${variant}`} role="alert">
      {dismissible ? (
        <button
          className="tw-float-right tw-cursor-pointer"
          onClick={hideAlert}
          aria-label="Dismiss Alert"
          type="button"
        >
          <Icon type="XMarkIcon" />
        </button>
      ) : null}
      <div className="hui-alert__body">
        {includesIcon && (
          <div className="hui-alert__icon">
            <Icon type={iconType(variant)} />
          </div>
        )}
        <div className="hui-alert__content">
          {title && <div className="hui-alert__content-title">{title}</div>}
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

export default Alert;
