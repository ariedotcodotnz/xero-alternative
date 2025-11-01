import React from "react";
import I18n from "../../../utilities/translations";

interface iMessageFooter {
  dueDate: InstanceType<typeof Date>;
  hideLegalName: boolean;
  tradingName?: string;
  userName?: string;
  model?: "invoice" | "quote";
  mainText: string;
};

const ctx = { scope: "invoice_mailer.send_invoice" };

const MessageFooter = ({
  mainText,
  dueDate,
  hideLegalName,
  tradingName,
  userName,
  model = "invoice",
}: iMessageFooter) => {
  if (dueDate) {
    const isNZ = window.Hnry?.User?.jurisdiction?.code === "nz";

    return (
      <>
        <p className="invoice-quote-email-text tw-mb-4">
          {mainText}
        </p>
        {(isNZ && model === "invoice") && (
          <p className="invoice-quote-email-text tw-mb-4">
            {`${I18n.t("cop_paragraph", ctx)} `}
            <button
              className="invoice-quote-email-link"
              type="button"
              disabled
            >
              {I18n.t("cop_link_text", ctx)}
            </button>.
          </p>
        )}

        <p className="invoice-quote-email-text tw-mb-2">Thanks,</p>
        {!hideLegalName && <p className="invoice-quote-email-sign tw-mb-0">{userName}</p>}
        <p className="invoice-quote-email-sign">{tradingName}</p>
      </>
    );
  }

  return null;
}

export default MessageFooter;
