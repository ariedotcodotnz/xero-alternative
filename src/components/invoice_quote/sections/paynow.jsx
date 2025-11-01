import React, { useEffect, useState } from "react";
import PayNowModal from "./paynow_modal";
import useProcessorSession from "./useProcessorSession";
import { makeAJAXRequest } from "../../utils/general_helpers";
import I18n, { storeRequiredLocales } from "../../../utilities/translations";

const PayNow = ({
  creditCardSurcharge,
  currencyOptions,
  enabled,
  invoiceToken,
  jurisdictionCode,
  jurisdictionCurrencyCode,
  paymentTotal,
}) => {
  if (jurisdictionCode) {
    storeRequiredLocales(jurisdictionCode);
    I18n.locale = jurisdictionCode;
  }

  const { configureModal, modalUrl, showModal } = useProcessorSession(jurisdictionCode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUrl = new URL(window.location);
    if (currentUrl) {
      const openModal = currentUrl.searchParams.get("begin_payment");

      if (openModal === "true") {
        createMerchantSession();
      }
    }
  }, []);

  const refreshInvoice = () => {
    let refreshPath = window.location.origin + window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const akey = "access_token";
    if(urlParams.get(akey)!=null) refreshPath += `?${akey}=${urlParams.get(akey)}`;

    Turbolinks.visit(refreshPath);
  };

  const handlePayNowRequestSuccess = (data) => {
    const response = JSON.parse(data);
    if (response.previouslyPaid) {
      refreshInvoice();
    } else {
      configureModal(response);
      $("#modalPayNow").modal("show");
    }
  };

  const handlePayNowRequestFail = (data) => {
    const response = JSON.parse(data);
    setLoading(false);
    toastr.error(response.message || "Something went wrong. Please try again later.");
  };

  const createMerchantSession = () => {
    setLoading(true);
    makeAJAXRequest(
      "GET",
      `/credit_card_payments/create_credit_card_payment?access_token=${invoiceToken}`,
      false,
      null,
      handlePayNowRequestSuccess,
      handlePayNowRequestFail,
    );
  };

  return (
    <div className="inv-center" id="pay-now-button">
      {showModal && <PayNowModal
        handleModalClose={refreshInvoice}
        total={paymentTotal}
        currencyOptions={currencyOptions}
        jurisdictionCurrencyCode={jurisdictionCurrencyCode}
        url={modalUrl}
      />}
      {!enabled && <>
        <br/>
        <div className="alert alert-info" role="alert">
          {I18n.t("credit_card_payments.disabled")}
        </div>
      </>}
      <button
        onClick={createMerchantSession}
        className="hnry-button hnry-button--primary hidden-on-print"
        disabled={!enabled || loading}
      >
        Pay via card
      </button>
      <p className="tw-text-sm tw-text-brand tw-mt-2">
        A convenience fee of <b>{creditCardSurcharge}%</b> will be added to online card payments
      </p>
    </div>
  );
};

export default PayNow;
