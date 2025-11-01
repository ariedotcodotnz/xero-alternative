import React, { useState } from "react";
import Switch from "../../_atoms/switch/Switch";
import Modal from "../../_molecules/modal/Modal";
import { blockCard } from "../../../API/cards.api";
import I18n from "../../../utilities/translations";

export default function CardBlock({ isBlocked = false }: { isBlocked: boolean}) {
  const [blocked, setBlocked] = useState(isBlocked);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleClicked, setToggleClicked] = useState(false);

  const confirmBlock = async () => {
    setToggleClicked(true);
    if (blocked) {
      try {
        await blockCard({ card_action: "unblock" });
        setBlocked(false);
        location.reload();
      } catch (err) {
        toastr.error("Unable to unblock card. Please try again.");
      }
    } else {
      setOpen(true);
    }
  };

  const setAccepted = async () => {
    setLoading(true);
    try {
      await blockCard({ card_action: "block" });
      setBlocked(true);
      setOpen(false);
    } catch (err) {
      toastr.error("Unable to block card. Please try again.");
    } finally {
      setLoading(false);
      location.reload();
    }
  };

  const blockedText = toggleClicked ? I18n.t("cards.block_card.switch_label_unblocking") : I18n.t("cards.block_card.switch_label_active");

  const labelText = blocked
    ? blockedText
    : I18n.t("cards.block_card.switch_label_inactive");

  const modalTitle = I18n.t("cards.block_card.confirmation_modal_title");

  const modalDescription = I18n.t(
    "cards.block_card.confirmation_modal_description",
  );

  return (
    <>
      <Switch
        label={labelText}
        id="block-card-switch"
        checked={blocked}
        onChange={confirmBlock}
      />
      <Modal
        open={open}
        setOpen={setOpen}
        onConfirm={setAccepted}
        title={modalTitle}
        confirmCTA="Block card"
        variant="danger"
        loading={loading}
      >
        {modalDescription}
      </Modal>
    </>
  );
}
