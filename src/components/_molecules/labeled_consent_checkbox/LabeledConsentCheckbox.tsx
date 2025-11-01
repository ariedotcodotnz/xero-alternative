import React from "react";
import DOMPurify from "dompurify";
import classNames from "classnames";
import ConsentCheckbox from "../../_atoms/consent_checkbox/ConsentCheckbox";

export interface iLabeledConsentCheckbox {
  ariaLabel?: string;
  id: string;
  label: string;
  name: string;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  supportingText?: string;
  disabled?: boolean;
  requiredLabel?: boolean
  checked?: boolean;
}

const LabeledConsentCheckbox = ({
  ariaLabel = "I agree",
  id = "",
  label = "I agree",
  name = "",
  onChange,
  required,
  supportingText = "",
  disabled = false,
  requiredLabel = false,
  checked,
}: iLabeledConsentCheckbox) => (
  <div className="tw-flex tw-items-start">
    <ConsentCheckbox
      id={id}
      name={name}
      onChange={onChange}
      ariaLabel={ariaLabel}
      required={required}
      disabled={disabled}
      checked={checked}
    />
    <div className="tw-flex tw-flex-col tw-items-start tw-ml-4">
      <label
        className={classNames(
          {
            "after:tw-content-['*'] after:tw-inline after:tw-text-red after:tw-ml-1": requiredLabel
          },
          "tw-text-sm tw-leading-tight tw-cursor-pointer tw-mb-0.5 tw-text-gray-700 [&>a]:tw-font-semibold [&>a]:tw-color-brand-700"
        )}
        htmlFor={id}
        // eslint-disable-next-line xss/no-mixed-html
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(label) }}
      ></label>
      {supportingText && (
        <p
          className="tw-text-gray-500"
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line xss/no-mixed-html
            __html: DOMPurify.sanitize(supportingText),
          }}
        ></p>
      )}
    </div>
  </div>
);

export default LabeledConsentCheckbox;
