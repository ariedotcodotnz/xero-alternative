import React, { useState } from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import Modal from "../../_molecules/modal/Modal";
import Button from "../../_atoms/button/Button";
import { sendCardDetails } from "../../../API/cards.api";
import I18n from "../../../utilities/translations";

export interface iRevealCardDetails {
  cardNumber: string;
  expiryDate: string;
  phoneNumber: string;
}

const defaultCardnumberMask = "XXXXXXXXXXXXXXXX";
const defaultCardexpiryMask = "XX/XX";

const ctx = { scope: "cards.index.card_details" };


const RevealCardDetails = ({
  cardNumber,
  expiryDate,
  phoneNumber,
}: iRevealCardDetails) => {
  const [detailsRevealed, setDetailsRevealed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalDescription = (
    <>
      <p>{I18n.t("modal_description_p1", ctx)}</p>
      <p>{I18n.t("modal_description_p2", ctx)}</p>
      <p>{I18n.t("modal_description_p3", ctx)}</p>
      <p className="tw-font-semibold">{phoneNumber}</p>
      <p>
        <a
          className="tw-font-semibold tw-text-brand-green-700 hover:tw-text-brand-green-900"
          href={Routes.settings_profile_index_path()}
        >
          <Icon classes="tw-inline-block tw-text-inherit tw-mr-1" size="sm" />
          {I18n.t("modal_update_details", ctx)}
        </a>
      </p>
    </>
  );

  const onConfirm = async () => {
    setLoading(true);
    try {
      await sendCardDetails();
      setDetailsRevealed(true);
    } catch (err) {
      toastr.error(I18n.t("modal_send_message_error", ctx));
      if (typeof Rollbar !== "undefined") { Rollbar.warning("Unable to send card details to user via SMS"); }
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const onRevealButtonClick = () => {
    if (detailsRevealed) {
      setDetailsRevealed(false);
    } else {
      setModalOpen(true);
    }
  };

  const formattedCardNumber = () => {
    const theNumber = detailsRevealed ? cardNumber : defaultCardnumberMask;
    return theNumber.replace(/(.{4})/g, "$1 ");
  };

  return (
    <>
      <div className="tw-px-1 tw-py-3">
        <div className="tw-flex tw-flex-wrap tw-gap-3">
          <div className="tw-basis-full">
            <h4 className="tw-text-sm tw-font-semibold tw-mb-1">
              Virtual card number
            </h4>
            <p className="tw-m-0 tw-text-xs tw-text-gray-950">
              {formattedCardNumber()}
            </p>
          </div>

          <div className="tw-flex-1">
            <h5 className="tw-text-sm tw-font-semibold tw-mb-1">CVV</h5>
            <p className="tw-m-0 tw-text-xs tw-text-gray-950">XXX</p>
          </div>
          <div className="tw-flex-1">
            <h5 className="tw-text-sm tw-font-semibold tw-mb-1">Expiry date</h5>
            <p className="tw-m-0 tw-text-xs tw-text-gray-950">
              {detailsRevealed ? expiryDate : defaultCardexpiryMask}
            </p>
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={onRevealButtonClick}
        classes="tw-w-full tw-my-2"
      >
        <Icon
          classes="tw-inline-block tw-align-bottom !tw-text-white tw-mr-3"
          size="sm"
          type={detailsRevealed ? "EyeSlashIcon" : "EyeIcon"}
        />
        {detailsRevealed ? "Hide details" : "Reveal details"}
      </Button>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onConfirm={onConfirm}
        title={I18n.t("modal_title", ctx)}
        confirmCTA="Reveal details"
        loading={loading}
      >
        {modalDescription}
      </Modal>
    </>
  );
};

export default RevealCardDetails;
