import React, { useState } from "react";
import { postJson } from "../../../API/config/fetch.api";
import AuthModal from "./AuthModal";
import Icon from "../../_atoms/icons/icon/Icon";
import Modal from "../../_molecules/modal/Modal";
import CardDetailsContent from "./CardDetailsContent";

interface CardTypes {
  card_name: string;
  card_number: string;
  expiry_date: string;
  cvv?: string;
}
export interface iCardDetails {
  userPhoneNumber: string;
  userEmail: string;
  otpRequiredForLogin: boolean;
  jurisdiction: string;
}

const CardDetails = ({
  otpRequiredForLogin,
  userPhoneNumber,
  userEmail,
  jurisdiction,
}: iCardDetails) => {
  const [cardDetails, setCardDetails] = useState<CardTypes | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const sendSMS = () => {
    postJson(Routes.send_card_details_cards_path(), undefined)
      .then(() => {
        toastr.success(
          `Details sent via SMS to *** *** ${userPhoneNumber.slice(-4)}`,
          { timeOut: 10000 },
        );
      })
      .catch(() => {
        toastr.error("SMS failed to send");
      });
  };

  const handleClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <button className="hnry-button hnry-button--link" onClick={handleClick}>
        <Icon type="EyeIcon" classes="!tw-mx-0" />
        <span className="tw-block tw-pt-2 tw-text-xs">Reveal</span>
      </button>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        confirmCTA={null}
        cancelCTA={null}
        title={cardDetails ? "Your card details" : "Let us know it's you"}
        closable
      >
        {!cardDetails ? (
          <AuthModal
            authenticatorApp={otpRequiredForLogin}
            setCardDetails={setCardDetails}
            userEmail={userEmail}
            sendSMS={sendSMS}
            jurisdiction={jurisdiction}
          />
        ) : (
          <CardDetailsContent
            cardName={cardDetails?.card_name}
            cardNumber={cardDetails?.card_number}
            expiryDate={cardDetails?.expiry_date}
            cvv={cardDetails?.cvv}
            sendSMS={sendSMS}
            jurisdiction={jurisdiction}
          />
        )}
      </Modal>
    </>
  );
};

export default CardDetails;
