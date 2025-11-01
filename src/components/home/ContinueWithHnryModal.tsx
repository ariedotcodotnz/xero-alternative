import React from "react"
import Button from "@hui/_atoms/button/Button";
import Modal from "@hui/_molecules/modal/Modal";
import { delinkScreens } from "./types";
import { continueWithHnry } from "./translations";

interface iContinueWithHnryModal {
  continueWithHnryModalOpen: boolean;
  setContinueWithHnryModalOpen: (boolean) => void;
  setFlowState: (string: delinkScreens) => void;
};

const { paragraph, title } = continueWithHnry;

const ContinueWithHnryModal = ({ continueWithHnryModalOpen, setContinueWithHnryModalOpen, setFlowState }: iContinueWithHnryModal) => {
  const handleYes = () => {
    setFlowState("allow_to_relink")
    setContinueWithHnryModalOpen(false)
  };

  const handleNo = () => {
    setFlowState("off_board_user")
    setContinueWithHnryModalOpen(false)
  };

  const handleClose = () => {
    setFlowState(undefined)
  }

  return (
    <Modal
      closable={true}
      open={continueWithHnryModalOpen}
      setOpen={setContinueWithHnryModalOpen}
      title={title}
      includesFooter={false}
      onCancel={handleClose}
      onOutsideCloseAction={handleClose}
    >
      <div>
        {paragraph}
      </div>
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between mt-1 hnry-dialog-panel-actions">
        <Button variant="primary" onClick={handleYes}>Yes</Button>
        <Button variant="secondary" onClick={handleNo}>No</Button>
      </div>
    </Modal>
  );
};

export default ContinueWithHnryModal
