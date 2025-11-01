import React from "react";
import Icon from "../icons/icon/Icon";
import Button from "../button/Button";
import Input from "./Input";

interface iInputCopy extends Partial<HTMLInputElement> {
  id?: string;
  label: string;
  className?: string;
   /**
   * The copy value
   */
  value: string;
  name: string;
  /**
  * Frontend tracking for click event
  */
  dataTrackClick?: TrackClick;
}

const InputCopy = ({
  dataTrackClick,
  id,
  className = "hnry-label",
  label,
  name,
  value,
}: iInputCopy) => {
  const idWithFallback = id || name || crypto.randomUUID();

  const handleClick = () => {
    navigator.clipboard.writeText(value).then(
      () => {
        toastr.success("Copied to clipboard");
      },
      () => {
        toastr.error("Copying failed");
      },
    );
  };

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-mb-3">
      <label htmlFor={idWithFallback} className={className}>
        {label}
      </label>
      <div className="tw-relative tw-shadow-sm">
        <Input
          id={idWithFallback}
          name={name}
          value={value}
          readOnly
          labelRendered={false}
          inputClasses="hnry-input-copy"
        />
        <Button
          onClick={handleClick}
          variant="unstyled"
          classes="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-mr-3"
          dataTrackClick={dataTrackClick}
        >
          <span className="tw-sr-only">{`Copy ${label}`}</span>
          <Icon type="DocumentDuplicateIcon" classes="tw-w-6 tw-h-6 tw-text-gray-700" hoverOn />
        </Button>
      </div>
    </div>
  );
};

export default InputCopy;
