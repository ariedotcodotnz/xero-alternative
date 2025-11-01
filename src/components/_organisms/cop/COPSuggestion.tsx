import React, { useEffect } from "react";
import I18n from "../../../utilities/translations";

interface iCOPWarningModal {
  sortCode: string,
  accountNumber: string,
  name: string,
  accountType: string
}

export const COPSuggestion = ({sortCode, accountNumber, name, accountType}: iCOPWarningModal) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('COPSuggestion mounted');
  })

  const renderInitialIcon = (name: string) => {
  const initials: string =  name.split(" ").map(namePart => namePart[0]).join("")

    return <span className="sm:tw-flex tw-items-center tw-gap-2 tw-justify-center sm:-tw-mx-4 tw-hidden tw-group tw-row-span-2">
    <span className="tw-text-white tw-block tw-rounded-full tw-bg-brand-violet">
      <span className="tw-flex tw-items-center tw-justify-center" style={{width: "3.5rem", height: "3.5rem"}} aria-hidden="true">
        <span className={initials.length > 2 ? "tw-text-lg" : "tw-text-2xl"}>{initials}</span>
      </span>
    </span>
  </span>
  }

  const formatSortCode = (sortCode: string) => sortCode.match(/\d{2}/g).join("-")

  return (
    <>
      <p className="!tw-text-gray-700 tw-mb-4 tw-font-semibold">{I18n.t("cop.did_you_mean")}</p>
      <div className="tw-rounded-md tw-shadow-md tw-bg-brand-25 tw-w-full tw-ps-4 sm:tw-ps-2 tw-pe-4 tw-mx-auto tw-mt-2 tw-mb-8">
      <div className="tw-grid tw-w-100 tw-grid-rows-1 tw-grid-flow-col">
            {renderInitialIcon(name)}
          <div className="tw-col-span-3">
          <div className="tw-flex tw-justify-between tw-border-b tw-border-gray-300 tw-mb-2 tw-pt-2 sm:tw-ms-2">
            <div className="tw-flex tw-justify-between tw-w-full tw-items-center">
              <h2 className="hui-card-heading__title">
                {name}
              </h2>
              <h2 className="!tw-text-brand-green tw-font-semibold hnry-heading--h2 tw-mb-0">{accountType}</h2>
            </div>
          </div>
          <div className="tw-flex tw-gap-2 tw-flex-row sm:tw-ms-2">
            <h3 className="hnry-heading--h3 tw-font-medium">{formatSortCode(sortCode)}</h3>
            <p className="hnry-heading--h3 tw-font-medium tw-mb-0"> | </p>
            <h3 className="hnry-heading--h3 tw-font-medium">{accountNumber}</h3>
          </div>
        </div>
      </div>
    </div>
    </>
  
  );
};