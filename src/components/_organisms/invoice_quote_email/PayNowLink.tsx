import React from "react";
import I18n from "../../../utilities/translations";

interface iPayNowLink {
  payableByCreditCard: boolean;
  surcharge: number;
}

const PayNowLink = ({
  payableByCreditCard,
  surcharge,
}: iPayNowLink) => {
  if (payableByCreditCard) {
    const isAu = window.Hnry?.User?.jurisdiction?.code === "au";

    return (
      <>
        <p className="invoice-quote-email-text">
          <button type="button" className="invoice-quote-email-link tw-pl-0" disabled>
            {I18n.t("invoices.pay_now_by_card")}
          </button>
        </p>
        {isAu && (
          <p className="invoice-quote-email-text">
            {I18n.t("invoices.convenience_fee", { surcharge })}
          </p>
        )}
      </>
    );
  }

  return null;
}

export default PayNowLink;
