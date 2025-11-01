import React, { ReactNode } from "react";
import classNames from "classnames";
import Icon from "../../_atoms/icons/icon/Icon";

interface iCopyButton {
  label: string;
  copyValue: string;
  children?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  buttonClasses?: string;
  eventName?: string;
}

const CopyButton = ({
  label,
  copyValue,
  children = undefined,
  onClick = undefined,
  buttonClasses,
  eventName,
}: iCopyButton) => {
  let successMsg = false;

  const handleClick = (e) => {
    navigator.clipboard.writeText(copyValue).then(
      () => {
        /* clipboard successfully set */
        successMsg = true;
        toastr.success(`${label} copied successfully`);
      },
      () => {
        /* clipboard write failed */
        toastr.error("Copying failed");
      },
    );

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={handleClick}
      className={classNames(
        "tw-flex tw-justify-center tw-rounded-md tw-border tw-border-gray-600 tw-p-1.5 tw-w-full",
        buttonClasses,
      )}
      data-track-click={eventName ? JSON.stringify({ eventName }) : null}
      data-copy-success={successMsg ? `"${copyValue}" copied` : null}
    >
      {children || <span className="tw-pr-4">{copyValue}</span>}
      <Icon type="DocumentDuplicateIcon" hoverOn />
    </button>
  );
};

export default CopyButton;
