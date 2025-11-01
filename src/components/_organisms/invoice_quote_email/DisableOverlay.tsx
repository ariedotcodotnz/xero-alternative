import React from "react";
import classNames from "classnames";

interface iDisableOverlay {
  editing: boolean;
  children: React.ReactNode;
}

const DisableOverlay = ({ editing, children }: iDisableOverlay) => (
  <div className={classNames({ "invoice-quote-email-text--disabled": editing })}>
    {children}
  </div>
);

export default DisableOverlay;
