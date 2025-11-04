import React, { ReactNode } from "react";
import classNames from "classnames";
import Icon from "../../_atoms/icons/icon/Icon";
// import "./styles.scss";

interface iBanner {
  /**
   * Background color uses to determine the color of the dismiss/close button. Default is false.
   */
  darkBackground?: boolean;
  /**
   * The content of the banner.
   */
  children: ReactNode;
  /**
   * Includes extra classes on the outer component's className attribute.
   */
  classes?: string;
}

const Banner = ({
  darkBackground = false,
  children,
  classes = undefined,
}: iBanner) => (
  <div className={classNames("hui-banner", { "hui-banner--dark": darkBackground, [`${classes}`]: classes })}>
    <div className="hui-banner-content">
      {children}
    </div>
    <div className="dismiss-button-wrapper">
      <button className="dismiss-button">
        <Icon type="XMarkIcon" hoverOn classes="tw-ml-1" />
        <span className="tw-sr-only">Dismiss</span>
      </button>
    </div>
  </div>
);

export default Banner;
