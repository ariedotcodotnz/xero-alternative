import React, { useState } from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import PaymentRequestModal from "./Modal";

export interface iPaymentRequest {
  canRequestPayment: boolean;
  clientId: number;
  clientName: string;
  url: string;
  maxInvoiceTotal: number;
}

const PaymentRequest = ({
  canRequestPayment,
  clientId,
  clientName,
  url,
  maxInvoiceTotal,
}: iPaymentRequest) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    window.analytics?.track("payment_request_clicked", { client_id: clientId });
  }

  return (
    <>
      <button className="hui-link" onClick={handleClick} id={`payment-request-${clientId}-btn`}>
        <span className="tw-sr-only">Request payment</span>
        <Icon type="SmsMobileIcon" classes="!tw-mr-0 tw-w-5 tw-h-5" />
      </button>
      <PaymentRequestModal
        isMobile={false}
        canRequestPayment={canRequestPayment}
        clientId={clientId}
        clientName={clientName}
        url={url}
        open={open}
        setOpen={setOpen}
        maxInvoiceTotal={maxInvoiceTotal}
      />
    </>
  );
}

export default PaymentRequest;
