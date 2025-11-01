import React, { useMemo } from "react";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import PayNow from "./paynow";
import PaymentDetails from "./PaymentDetails";
import I18n from "../../../utilities/translations";

const PAID_STATUSES = ["PAYMENT_PROCESSING", "PAID", "DRAFT", "PART_PAID"];

interface iInvoiceFooter {
  showPayNowButton?: boolean;
  showPaymentDetails?: boolean;
  tradingNameOrName: string;
}

const InvoiceFooter = ({
  showPayNowButton,
  showPaymentDetails,
  tradingNameOrName,
}: iInvoiceFooter) => {
  const {
    otherProps, currencyOptions, invoiceObject, comments, grandTotal, status,
  } = useInvoiceQuoteContext();
  const { invoice_number: invoiceNumber, access_token: accessToken } = invoiceObject;
  const {
    gst_type: gstType,
    hnry_bank_account: hnryBankAccount,
    payable_by_credit_card: payableByCreditCard,
    jurisdiction_currency_code: jurisdictionCurrencyCode,
    jurisdiction,
    model,
    credit_card_surcharge: creditCardSurcharge,
    credit_card_minimum_amount: creditCardMinimumAmount,
    credit_card_payment_enabled: creditCardPaymentEnabled,
    accept_quote_url: acceptQuoteUrl,
    accept_quote_disabled: acceptQuoteDisabled,
    converted,
  } = otherProps;

  const showPayNow = showPayNowButton && !PAID_STATUSES.includes(status) && payableByCreditCard && grandTotal >= creditCardMinimumAmount;
  const showAcceptQuoteButton = model === "quote" && status === "SENT" && !converted;

  const commentsAsParagraphs = useMemo(() => (
    comments ? comments.split(/\n/g) : ""
  ), [comments]);

  return (
    <>
      {showPaymentDetails ? (
        <PaymentDetails zeroRated={gstType === "ZERO"} bankAccountDetails={hnryBankAccount} />
      ) : <hr className="primary" />}
      {commentsAsParagraphs &&
        <>
          <strong className="tw-block tw-mt-4">{model[0].toUpperCase() + model.slice(1)} comments:</strong>
          {commentsAsParagraphs.map((comment, index) => <p className="tw-mb-2" key={`comment_${index}`}>{comment}</p>)}
        </>
      }
      {(jurisdiction === "uk") && (showPaymentDetails && model !== "quote") && (
        <p className="tw-flex tw-mt-3 tw-text-xs">
          {I18n.t("invoices.show.edenred_blurb")}
        </p>
      )}
      {model !== "quote" && (
        <p className="tw-flex tw-mt-2 tw-text-base">
          <strong>When paying, please use the reference: <span className="tw-whitespace-nowrap tw-pl-2">{invoiceNumber}</span></strong>
        </p>
      )}
      {model === "invoice" && jurisdiction === "nz" && (
        <div className="tw-text-xs">
          Save this account information as a Payee in your internet banking for easier future payments.
        </div>
      )}
      <div className="tw-flex tw-my-2 tw-justify-between">
        <div className="tw-text-xs">
          For any queries relating to this {model} please contact {tradingNameOrName}
        </div>
        <div className="tw-text-xs">Private & Confidential</div>
      </div>
      {showPayNow && <PayNow
                      paymentTotal={grandTotal}
                      invoiceToken={accessToken}
                      currencyOptions={currencyOptions}
                      jurisdictionCurrencyCode={jurisdictionCurrencyCode}
                      jurisdictionCode={jurisdiction}
                      creditCardSurcharge={creditCardSurcharge}
                      enabled={creditCardPaymentEnabled}
                    />}
      {showAcceptQuoteButton && (
        <div className="tw-flex tw-w-full tw-justify-center">
          {acceptQuoteDisabled ?
            <button className="hnry-button hnry-button--primary hidden-on-print" disabled>{I18n.t("quotes.show.accept")}</button>
              : <a href={acceptQuoteUrl} className="hnry-button hnry-button--primary hidden-on-print">{I18n.t("quotes.show.accept")}</a>
          }
        </div>
      )}
    </>
  );
};

export default InvoiceFooter;
