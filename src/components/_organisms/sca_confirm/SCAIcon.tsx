import React from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import { SCA_FAILED, SCA_SUCCESS, confirmStatusType } from "./types";
// import "./styles.scss";

interface iSCAIcon {
  confirmStatus: confirmStatusType;
}

const SCAIcon = ({
  confirmStatus,
}: iSCAIcon) => {
  if (confirmStatus === SCA_FAILED) {
    return (
      <span className="hui-sca__header-icon tw-bg-red-100">
        <Icon type="XMarkIcon" classes="tw-text-red-700 tw-w-6 tw-h-6" />
      </span>
    );
  }

  if (confirmStatus === SCA_SUCCESS) {
    return (
      <span className="hui-sca__header-icon tw-bg-green-50">
        <span className="tw-h-6 tw-w-6 tw-rounded-full tw-absolute">
          <Icon type="CheckIcon" classes="hui-sca__success-icon" />
        </span>
      </span>
    );
  }

  return (
    <span className="hui-sca__header-icon tw-bg-gray-100">
      <Icon type="LockClosedIcon" classes="tw-text-gray-700 tw-w-6 tw-h-6 tw-animate-pulse" />
    </span>
  );
}

export default SCAIcon;
