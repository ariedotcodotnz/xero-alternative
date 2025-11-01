import React from "react"

const Paragraph = ({children}: {children: string | JSX.Element}) => ( 
  <p className="tw-text-gray-700 tw-text-base tw-mb-6">
    {children}
  </p>
)

export default Paragraph