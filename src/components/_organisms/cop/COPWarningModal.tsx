import React, { useEffect } from "react";

interface iCOPWarningModal {
  subheading: string;
  reasons: string[];
  subheading2: string;
}

const COPWarningModal = ({ reasons, subheading, subheading2}: iCOPWarningModal) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('COPWarningModal mounted');
  })

  const renderReasons = () => {
    if(reasons.length == 0) return <></>
    return <ul className="tw-text-gray-700 tw-ml-4 tw-mb-4 list-disc">
      {reasons.map((reason, index) => <li className="tw-pl-2" key={index}>{reason}{!reasons[index+1] ? "." : ";"}</li>)}
    </ul>
  }

  return (
    <div className="tw-flex tw-justify-between tw-text-justify tw-flex-col">
      <p className="!tw-text-gray-700 tw-mb-4">{subheading}</p>
      {renderReasons()}
      { subheading2 && <p className="!tw-text-gray-700 tw-mb-6">{subheading2}</p>}
    </div>
  );
};

export default COPWarningModal;