import React from "react"
import Modal from "@hui/_molecules/modal/Modal";
import { interimConfirmation } from "./translations";

interface iInterimConfirmationModal {
  interimConfirmationModalOpen: boolean;
  setInterimConfirmationModalOpen: (boolean) => void;
}

const { title, paragraph } = interimConfirmation

const InterimConfirmationModal = ({ interimConfirmationModalOpen, setInterimConfirmationModalOpen }: iInterimConfirmationModal) => {
  const handleConfirm = () => {
    setInterimConfirmationModalOpen(false)
    Turbolinks.visit(window.location.href)
  };

  return (
    <Modal
      closable={true}
      confirmCTA="Done"
      open={interimConfirmationModalOpen}
      setOpen={setInterimConfirmationModalOpen}
      title={title}
      onCancel={handleConfirm}
      onConfirm={handleConfirm}
      onOutsideCloseAction={handleConfirm}
    >
      <div className="list-disc tw-prose-sm tw-prose-grey">
        {paragraph}
      </div>
    </Modal>
  )
}

export default InterimConfirmationModal
