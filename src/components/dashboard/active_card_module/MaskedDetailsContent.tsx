import React from "react";
import Input from "../../_atoms/input/Input";
import InputCopy from "../../_atoms/input/InputCopy";
import Alert from "../../_molecules/alert/Alert";

export interface iMaskedDetailsContent {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  sendSMS(): void;
}

const MaskedDetailsContent = ({
  cardName,
  cardNumber,
  expiryDate,
  sendSMS,
}: iMaskedDetailsContent) => {
  const cardDetailsDisplay = (fullCardNumber: string) =>
    `${fullCardNumber.slice(0, 4)} ${fullCardNumber.slice(4, 8)} ${fullCardNumber.slice(8, 12)} ${fullCardNumber.slice(12, 16)}`;

  return (
    <>
      <InputCopy label="Card name" name="cardName" value={cardName} />
      <Input
        label="Card number"
        name="cardNumber"
        value={cardDetailsDisplay(cardNumber)}
      />
      <div className="tw-my-3 tw-flex tw-flex-row tw-gap-8">
        <div className="tw-flex-grow">
          <InputCopy label="Exp:" name="expiry" value={expiryDate} />
        </div>
        <div className="tw-flex-grow">
          <Input label="CVV:" name="cvv" disabled value="***" />
        </div>
      </div>

      <div className="tw-mb-8">
        <Alert variant="info" includesIcon={false}>
          For security purposes, remaining card numbers and CVV will be send via
          SMS.
        </Alert>
      </div>
      <button
        className="hnry-button hnry-button--tertiary tw-w-full"
        onClick={sendSMS}
      >
        Resend SMS
      </button>
    </>
  );
};

export default MaskedDetailsContent;
