import React from "react";
import FullDetailsContent from "./FullDetailsContent";
import MaskedDetailsContent from "./MaskedDetailsContent";

export interface iCardContent {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  jurisdiction: string;
  sendSMS(): void;
}

const CardDetailsContent = ({
  cardName,
  cardNumber,
  expiryDate,
  cvv,
  jurisdiction,
  sendSMS,
}: iCardContent) =>
  jurisdiction === "uk" ? (
    <FullDetailsContent
      cardName={cardName}
      cardNumber={cardNumber}
      expiryDate={expiryDate}
      cvv={cvv}
    />
  ) : (
    <MaskedDetailsContent
      cardName={cardName}
      cardNumber={cardNumber}
      expiryDate={expiryDate}
      sendSMS={sendSMS}
    />
  );

export default CardDetailsContent;
