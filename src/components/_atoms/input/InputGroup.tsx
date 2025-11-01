import React from "react";
import classNames from "classnames";

interface iInputGroup {
  children: React.ReactNode;
  inputGroupClasses?: string;
}

const InputGroup = ({ children, inputGroupClasses }: iInputGroup) => (
  <div className={classNames("tw-relative", { [inputGroupClasses]: inputGroupClasses })}>
    {children}
  </div>
);

export default InputGroup;
