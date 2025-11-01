import React, { MouseEventHandler, forwardRef } from "react";
import classNames from "classnames";
import Icon, { IconType } from "../icons/icon/Icon";
import { TrackClick } from "../../../global";

interface ButtonToIconSize {
  (size: "tiny" | "small" | "medium" | "large"): IconTypeSize;
}

type IconTypeSize = "xs" | "sm" | "base";

const buttonToIconSize: ButtonToIconSize = (size) => {
  switch (size) {
    case "tiny":
      return "xs";
    case "small":
      return "xs";
    case "medium":
      return "sm";
    case "large":
      return "base";
    default:
      return "sm";
  }
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * What extra classes should be applied to the button?
   */
  classes?: string;
  /**
   * Should we prevents the user from interacting with the button? When true it cannot be pressed or focused.
   */
  disabled?: boolean;
  /**
   * What Icon is shown?
   */
  iconType?: IconType;
  /**
   * Is the Icon shown after the text? Defaults to before.
   */
  iconEnd?: boolean;
  /**
   * Is the button shown on a dark background (not darkmode)
   */
  invert?: boolean;
  /**
   * Are we loading anything?
   */
  loading?: boolean;
  /**
   * Specifies the name for the button
   */
  name?: string;
  /**
   * Optional click handler
   */
  onClick?: MouseEventHandler;
  /**
   * How large should the button be?
   */
  size?: "tiny" | "small" | "medium" | "large";
  /**
   * What type of button are you trying to render?
   */
  type?: "button" | "submit" | "reset";
  /**
   * Is this the principal call to action on the page?
   */
  variant?:
    | "admin"
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "link"
    | "unstyled";
  /**
   * Specifies the initial value for the button
   */
  value?: string;
  /**
   * Frontend tracking for click event
   */
  dataTrackClick?: TrackClick;
  /**
   * value to use for testing component in jest
   */
  dataTestId?: string;
}

/**
 * Primary UI component for user interaction
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    classes,
    disabled = false,
    iconType,
    iconEnd = false,
    invert = false,
    loading = false,
    size = "medium",
    type = "button",
    variant = "primary",
    dataTrackClick = undefined,
    name,
    value,
    dataTestId,
    ...remainingProps
  } = props;
  const loadingMode = loading ? "hnry-button--loading" : null;
  const iconPadding = ["tiny", "small"].includes(size) ? 1 : 2;
  return (
    <button
      // We are providing a type here but the linter is not happy with it...
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={
        variant === "unstyled"
          ? classes
          : classNames(
              "hnry-button",
              `hnry-button--${size}`,
              `hnry-button--${variant}`,
              { "hnry-button--icon-end": iconEnd },
              { "hnry-button--invert": invert },
              loadingMode,
              classes,
            )
      }
      ref={ref}
      disabled={disabled}
      name={name}
      value={value}
      data-track-click={JSON.stringify(dataTrackClick)}
      data-testid={dataTestId}
      // Need to spread remainingProps to ensure Radix UI works correctly
      // https://www.radix-ui.com/primitives/docs/guides/composition#your-component-must-spread-props
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
    >
      {iconType && !iconEnd && (
        <Icon
          classes={`tw-mr-${iconPadding}`}
          type={iconType}
          size={buttonToIconSize(size)}
        />
      )}
      {children}
      {iconType && iconEnd && (
        <Icon type={iconType} size={buttonToIconSize(size)} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
