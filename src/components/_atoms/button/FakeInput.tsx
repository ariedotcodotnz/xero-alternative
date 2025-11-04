import React from "react";
import Icon, { IconType } from "../icons/icon/Icon";
// import "./styles.scss";

const allowedIconChars = ["%"];

interface FakeInputProps {
  ariaLabel?: string;
  buttonLabel: string;
  buttonText: string;
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  rightIcon?: IconType;
}

const FakeInput = ({
  ariaLabel = "",
  buttonLabel = "",
  buttonText,
  id,
  onClick,
  rightIcon,
}: FakeInputProps) => {
  return (
    <>
      {buttonLabel && <p className="hnry-label">{buttonLabel}</p>}
      <button
        aria-label={ariaLabel}
        className="hnry-button--fake-input"
        id={id}
        onClick={onClick}
        type="button"
      >
        {buttonText}
        {rightIcon && (
          <div className="hnry-button--fake-input__right-icon">
            {allowedIconChars.includes(rightIcon) ? (
              <span>{rightIcon}</span>
            ) : (
              <Icon type={rightIcon} />
            )}
          </div>
        )}
      </button>
    </>
  );
};

export default FakeInput;
