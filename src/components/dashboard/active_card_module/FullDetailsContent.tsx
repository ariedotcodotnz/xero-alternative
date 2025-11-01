import React from "react";
import InputCopy from "../../_atoms/input/InputCopy";

export interface iFullDetailsContent {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const FullDetailsContent = ({
  cardName,
  cardNumber,
  expiryDate,
  cvv,
}: iFullDetailsContent) => (
  <>
    <InputCopy label="Card name" name="cardName" value={cardName} />
    <InputCopy label="Card number" name="cardNumber" value={cardNumber} />
    <div className="tw-my-3 tw-flex tw-flex-row tw-gap-8">
      <div className="tw-flex-grow">
        <InputCopy label="Exp:" name="expiry" value={expiryDate} />
      </div>
      <div className="tw-flex-grow">
        <InputCopy label="CVV:" name="cvv" value={cvv} />
      </div>
    </div>
  </>
);

export default FullDetailsContent;
