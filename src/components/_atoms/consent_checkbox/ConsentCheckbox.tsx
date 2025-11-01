import React, { useRef } from "react";
import Checkbox from "../checkbox/Checkbox";

export interface iConsentCheckbox {
  ariaLabel?: string;
  id: string;
  name: string;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
}

const ConsentCheckbox = ({
  ariaLabel,
  id = "",
  name = "",
  onChange,
  required,
  disabled = false,
  checked,
}: iConsentCheckbox) => {
  const myRef = useRef(null);

  const onConsentCheckboxChange = (checked: boolean) => {
    if (typeof onChange !== "undefined") onChange(checked);

    const consentEvent = new CustomEvent("hnry:consent_changed", {
      bubbles: true,
      detail: { name, consent_given: checked },
    });

    myRef.current.dispatchEvent(consentEvent);

    const virtualChangeEvent = new CustomEvent("change", {
      bubbles: true,
      detail: { checked },
    });

    myRef.current.dispatchEvent(virtualChangeEvent);
  };

  return (
    <Checkbox
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={onConsentCheckboxChange}
      ariaLabel={ariaLabel}
      myRef={myRef}
      required={required}
      disabled={disabled}
    />
  );
};

export default ConsentCheckbox;
