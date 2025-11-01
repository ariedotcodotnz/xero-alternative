import React from "react";
import CopyButton from "../../_molecules/copy_button/CopyButton";

export interface iCopyLineItem {
  label: string;
  eventName: string;
  value: string;
}

const CopyLineItem = ({ label, eventName, value }: iCopyLineItem) => (
  <div className="tw-flex tw-items-center tw-justify-between tw-text-sm tw-text-gray-900">
    <div>
      <span className="tw-font-semibold sm:tw-pr-2">{label}</span>&nbsp;
      <span>{value}</span>
    </div>
    <div className="!tw-content-end">
      <CopyButton
        copyValue={value}
        label={label}
        buttonClasses="tw-border-0"
        eventName={eventName}
      >
        <span className="tw-sr-only">Copy {label}</span>
      </CopyButton>
    </div>
  </div>
);

export default CopyLineItem;
