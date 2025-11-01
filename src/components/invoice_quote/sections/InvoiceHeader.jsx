import React, { useRef, useEffect } from "react";
import { drawImage } from "../../utils/InvoicesHelper";
import I18n from "../../../utilities/translations";

const InvoiceHeader = ({
  showTaxOnTitle,
  tradingName,
  userName,
  businessNumber,
  address,
  hideAddress,
  jurisdiction,
  logo,
  model,
  hidePhoneNumber,
  phoneNumber,
}) => {
  const LogoRef = useRef(null);

  useEffect(() => {
    drawImage(LogoRef.current, logo);
  }, [logo]);

  return (
    <>
      <header className="d-flex justify-content-between mb-2">
        {logo && (
          <div>
            <canvas ref={LogoRef} aria-label={tradingName} className="inv-prev-img" />
          </div>
        )}
        <div className="text-right ml-auto">
          <h1 className="tw-font-medium">{showTaxOnTitle && model === "INVOICE" && "TAX "}{model}</h1>
          <div className="tw-font-semibold">{tradingName || userName}</div>
          {(jurisdiction === "uk" && tradingName) && <div>{userName}</div>}
          {businessNumber && <div><strong>{`${I18n.t("global.business_number")}: ${businessNumber}`}</strong></div>}
          {(!hidePhoneNumber && phoneNumber !== null) && <div>{phoneNumber}</div>}
          {(!hideAddress && address !== null) && <Address values={Object.values(address)}/>}
        </div>
      </header>
      <hr className="primary" />
    </>
  );
};

const Address = ({ values }) => (
  values.map((addressLine, index) => (
    addressLine && <div key={`${addressLine}_${index}`}>{addressLine}</div>
  ))
);

export default InvoiceHeader;
