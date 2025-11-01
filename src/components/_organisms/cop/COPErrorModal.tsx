import React, { useEffect } from "react";

interface iCOPErrorModal {
  subheading: string;
  centerText?:boolean;
  subheading2: string
}

const COPErrorModal = ({ subheading, centerText, subheading2}: iCOPErrorModal) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('COPErrorModal mounted');
  })

  return (
    <div className={`tw-flex tw-justify-between ${centerText ? "tw-text-center" : "tw-text-justify"} tw-flex-col`}>
      <p className="!tw-text-gray-700 tw-mb-4">{subheading}</p>
      { subheading2 && <p className="!tw-text-gray-700 tw-mb-6">{subheading2}</p>}
    </div>
  );
};

export default COPErrorModal;
