import React, { useMemo } from "react";
import I18n from "../../../utilities/translations";

interface iBankAccountDetails {
  bank_name: string;
  bsb: string;
  name: string;
  number: number;
  routing_code: string;
  swift_code: string;
  pay_id?: string;
}

interface iPaymentDetails {
  zeroRated: boolean;
  bankAccountDetails: iBankAccountDetails;
}

const PaymentDetails = ({
  zeroRated,
  bankAccountDetails,
}: iPaymentDetails) => {

  const {
    bank_name: bankName,
    bsb,
    name,
    number,
    routing_code: routingCode,
    swift_code: swiftCode,
    pay_id: payId,
  } = bankAccountDetails;
  const coreItems = useMemo(() => {
    const payableBankAccountName = zeroRated ? "Hnry Limited" : name;

    const items = [{ label: "Account name", value: payableBankAccountName }]
    if (bsb) {
      items.push({
        label: I18n.t("users.financial.account_details.bank_code_name"),
        value: bsb,
      });
    }
    
    items.push({ label: "Account number", value: number?.toString() });

    if (payId) {
      items.push({ label: "PayID", value: payId });
    }

    return items;
  }, [zeroRated, name, bsb, number, payId]);

  const extraItems = useMemo(() => [
    { label: "SWIFT/BIC", value: swiftCode },
    { label: "BSB/Routing Code", value: routingCode },
    { label: "Bank Name", value: bankName },
  ], [swiftCode, routingCode, bankName]);

  return (
    <>
      <hr className="tw-border-brand-green" />
      <section>
        <h2 className="hnry-heading hnry-heading--h1 tw-text-brand-green"><strong>Please make payment to:</strong></h2>
        <div className="tw-flex tw-justify-between tw-my-1">
          <div>
            {coreItems.map(({ label, value }) => (
              value && (
                <div className="tw-flex tw-justify-between" key={`payment-details-${label}-${value}`}>
                  <span>{label}: </span>
                  <span className="tw-ml-3">{value}</span>
                </div>
              )))}
          </div>
          <div>
            {zeroRated && extraItems.map(({ label, value }) => (
              value && (
                <div className="tw-flex tw-justify-between" key={`extra-payment-details-${label}-${value}`}>
                  <span>{label}: </span>
                  <span>{value}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentDetails;
