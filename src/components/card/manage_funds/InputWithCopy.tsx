import React from "react";
import Icon from "../../icon/Icon";

interface iInputWithCopy {
  labelText: string;
  id: string;
  value: string;
  copyExclude?: string;
  classes?: string;
}

const InputWithCopy = ({
  labelText,
  id,
  value,
  copyExclude = "",
  classes = "",
}: iInputWithCopy) => (
  <div className={`hnry-form ${classes}`}>
    <label htmlFor={id} className="active">
      {labelText}
    </label>
    <input
      type="text"
      name={id}
      id={id}
      value={value}
      className="hnry-form-control"
      data-copy-trigger={`copy-${id}`}
      data-copy-exclude={copyExclude}
      readOnly
    />
    <Icon
      type="actions/copy"
      className="copy-trigger copy-input"
      data-copy-success={`${labelText} copied!`}
      label={`Copy ${labelText}`}
      id={`copy-${id}`}
      asButton
    />
  </div>
);

export default InputWithCopy;