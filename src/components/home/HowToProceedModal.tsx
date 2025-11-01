import React from "react"
import Button from "@hui/_atoms/button/Button";
import Modal from "@hui/_molecules/modal/Modal";
import { delinkScreens } from "./types";
import { howToProceed } from "./translations";

interface iHowToProceedModal {
  howToProceedModalOpen: boolean;
  setHowToProceedModalOpen: (boolean) => void;
  setFlowState: (string: delinkScreens) => void;
}

const { intentionallyDelinkedButton, interimDelinkedButton, paragraphHtml, title } = howToProceed

const HowToProceedModal = ({ howToProceedModalOpen, setHowToProceedModalOpen, setFlowState }: iHowToProceedModal) => {
  const handleInterimDelinked = () => {
    setFlowState("interim_delinked")
    setHowToProceedModalOpen(false)
  };

  const handleIntentionallyDelinked = () => {
    setFlowState("intentionally_delinked")
    setHowToProceedModalOpen(false)
  }

  return (
    <Modal
      closable={true}
      open={howToProceedModalOpen}
      setOpen={setHowToProceedModalOpen}
      title={title}
      includesFooter={false}
    >
      {/* eslint-disable-next-line xss/no-mixed-html */}
      <div className="list-disc tw-prose-sm tw-prose-grey" dangerouslySetInnerHTML={{ __html: paragraphHtml }} />
      <div className="tw-flex tw-gap-4 tw-flex-col mt-1">
        <Button variant="primary" onClick={handleInterimDelinked}>{interimDelinkedButton}</Button>
        <Button variant="secondary" onClick={handleIntentionallyDelinked}>{intentionallyDelinkedButton}</Button>
      </div>
    </Modal>
  )
}

export default HowToProceedModal
