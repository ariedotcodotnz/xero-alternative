import React, { useState } from "react";
import { activateCard } from "@hui/utils/CardActivationHelper";
import Button from "../../_atoms/button/Button";
import Modal from "../../_molecules/modal/Modal";
import CardsTnCsTextAu from "./au/CardsTnCsText";
import CardsTnCsTextNz from "./nz/CardsTnCsText";
import Scrollable from "../../_atoms/scrollable/Scrollable";

const introText = "Please review and accept the terms and conditions before continuing.";
const outroText = "By continuing you agree to the terms and conditions above.";

interface iCardsTnCs {
  cta: string;
  title: string;
  jurisdiction: "au" | "nz" | "uk";
  disabled?: boolean;
}

const CardsTnCs = ({
  cta,
  title,
  jurisdiction,
  disabled,
}: iCardsTnCs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const onAccepted = async () => {
    setIsLoading(true);

    await activateCard();
    setIsAccepted(true);

    setIsLoading(false);
    setIsOpen(false);
    setIsDisabled(true);
  };

  const onContentSeen = () => {
    setHasRead(true);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        dataTrackClick={{ eventName: "card_join_the_waitlist_btn_clicked" }}
        disabled={isAccepted ? isDisabled : disabled}>
        {cta}
      </Button>
      <Modal
        confirmCTA={cta}
        disabled={!hasRead}
        double={true}
        loading={isLoading}
        onConfirm={onAccepted}
        open={isOpen}
        setOpen={setIsOpen}
        title={title}
      >
        <p className="tw-text-xs sm:tw-text-sm tw-mb-2">{introText}</p>
        <div className="tw-mb-4">
          <Scrollable onContentSeen={onContentSeen}>
            { (jurisdiction === "au") ? 
              <CardsTnCsTextAu /> : <CardsTnCsTextNz />
            }
          </Scrollable>
        </div>
        <p className="tw-text-xs sm:tw-text-sm tw-mb-1">{outroText}</p>
      </Modal>
    </>
  );
};

export default CardsTnCs;
