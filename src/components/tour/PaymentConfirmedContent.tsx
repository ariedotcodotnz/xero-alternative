import React from "react";

interface iPaymentConfirmedContent {
  taxesImagePath: string,
  transferImagePath: string,
  feeImagePath: string,
  demonstrationPayAmount: string,
}

function PaymentConfirmedContent({ 
  taxesImagePath,
  transferImagePath,
  feeImagePath,
  demonstrationPayAmount,
}: iPaymentConfirmedContent) {

  const paidValueText = "We transferred the remainder to your personal bank account"

  return (
    <div>
      <div className="paid-value">
        <img src={taxesImagePath} className="paid-value-img" alt="Calculator"/>
        <p className="tw-my-4">
          We automatically calculated, and deducted all your taxes on your&nbsp;
          {demonstrationPayAmount}
        </p>
      </div>

      <div className="paid-value">
        <img src={transferImagePath} className="paid-value-img" alt="Piggy bank" />
        <p className="tw-my-4">
          {paidValueText}
        </p>
      </div>

      <div className="paid-value">
        <img src={feeImagePath} className="paid-value-img" alt="Donut graph" />
        <p className="tw-my-4">
          We even claimed our 1% fee as a business expense for you
        </p>
      </div>
    </div>
  );
}

export default PaymentConfirmedContent;
