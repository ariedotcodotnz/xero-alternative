import React from "react";

interface iInputRightIcon {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

const InputRightIcon = ({ children, onClick, ariaLabel }: iInputRightIcon) =>
  onClick ? (
    <button
      className="hnry-input__right-icon hnry-input__right-icon--clickable"
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  ) : (
    <div className="hnry-input__right-icon">
      {children}
    </div>
  );

export default InputRightIcon;
