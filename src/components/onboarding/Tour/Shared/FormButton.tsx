import React, { ReactNode } from "react"
import classNames from "classnames";

const FormButton = ({children, classes}: {children: ReactNode, classes?: string}) => (
  <div className={classNames("tw-w-full tw-pt-4 tw-pb-3 md:tw-pb-0 tw-opacity-100 tw-bg-white md:tw-rounded-b-lg", {[`${classes}`]: classes})}>
    {children}
  </div>
)

export default FormButton