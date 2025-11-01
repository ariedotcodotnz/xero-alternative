import React, { useState } from "react";
import Confetti from "../confetti";
import PaymentConfirmedPreviewContent from "./PaymentConfirmedPreviewContent";
import PaymentConfirmedContent from "./PaymentConfirmedContent";

interface iConfettiPaymentConfirmedScreen {
  taxesImagePath: string,
  transferImagePath: string,
  feeImagePath: string,
  demonstrationPayAmount: string,
  previewDemoPay: boolean,
}

function ConfettiPaymentConfirmedScreen({ 
  taxesImagePath,
  transferImagePath,
  feeImagePath,
  demonstrationPayAmount,
  previewDemoPay,
}: iConfettiPaymentConfirmedScreen) {
  const [areValueItemsVisible, setAreValueItemsVisible] = useState(false);

  const title = previewDemoPay ? 
    "Your account is ready!" : 
    "You just got paid!"

  const content = previewDemoPay ? 
    <PaymentConfirmedPreviewContent taxesImagePath={taxesImagePath} transferImagePath={transferImagePath} feeImagePath={feeImagePath} demonstrationPayAmount={demonstrationPayAmount} /> : 
    <PaymentConfirmedContent taxesImagePath={taxesImagePath} transferImagePath={transferImagePath} feeImagePath={feeImagePath} demonstrationPayAmount={demonstrationPayAmount} />

  return (
    <Confetti
      onAnimationComplete={() => setAreValueItemsVisible(true)}
      title={title}
    >
      {areValueItemsVisible && content}
    </Confetti>
  );
}

export default ConfettiPaymentConfirmedScreen;
