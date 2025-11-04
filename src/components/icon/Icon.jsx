import React, { useEffect, useState } from "react";
import { usePopover } from "../utils/Hooks";

const Icon = ({
  type,
  popover,
  label,
  hidden,
  disabled,
  asButton,
  disabledIconButton,
  className = "tw-inline-block tw-w-12 tw-h-12",
  title = "",
  ...btnProps
}) => {
  const [classes, setClasses] = useState("");

  // Determine the right className for the Icon given the props
  useEffect(() => {
    let name = "hnry-icon";
    const formattedType = type.replace("/", "-");
    name = `${name} ${formattedType}${disabled ? " icon-disabled" : ""}`;
    setClasses(name);
  }, []);

  // Use a drop in Hook to add a popover
  const popoverProps = usePopover({ ...popover, otherClasses: classes });

  const icon = (
    <span
      role="img"
      aria-label={label}
      aria-hidden={hidden}
      {...popoverProps}
      className={asButton ? popoverProps.className : `${className} ${popoverProps.className}`}
      title={title}
    >
      <img
        // src={require(`../../../assets/images/icons/${type}.svg`)}
        alt={label || ""}
        className="tw-w-full tw-h-full"
      />
    </span>
  );

  // Render the Icon as a button if needed
  return asButton ? <IconButton {...{ className, disabled: disabledIconButton, ...btnProps }}>{icon}</IconButton> : icon;
};

const IconButton = ({
  children, className, disabled, ...btnProps
}) => (
  <button type="button" className={`btn-small ${className || ""}`} disabled={disabled || false} {...btnProps}>
    {children}
  </button>
);

export default Icon;
