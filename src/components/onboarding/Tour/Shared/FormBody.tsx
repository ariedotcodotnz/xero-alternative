import React, { ReactNode } from "react"
import classNames from "classnames";

const FormBody = ({ children, classes }: { children: ReactNode, classes?: string }) => (
  <div className={classNames("tw-block tw-rounded-md tw-h-auto tw-flex-1 tw-overflow-y-auto", { [`${classes}`]: classes })}>
    {children}
  </div>
)

export default FormBody