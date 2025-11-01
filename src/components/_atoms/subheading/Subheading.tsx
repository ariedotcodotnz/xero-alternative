import React from "react"

const Subheading = ({children}: {children: string | JSX.Element}) => ( 
  <h6 className="tw-text-gray-700 tw-font-semibold">
    {children}
  </h6>
)

export default Subheading