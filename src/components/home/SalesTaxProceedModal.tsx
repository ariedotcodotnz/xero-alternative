import React from "react"
import Button from "@hui/_atoms/button/Button";
import Modal from "@hui/_molecules/modal/Modal";
import { delinkScreens } from "./types";
import { salesTaxProceed } from "./translations";

interface iSalesTaxProceedModal {
  intercomLink: string,
  salesTaxProceedModalOpen: boolean;
  setSalesTaxProceedModalOpen: (boolean) => void;
  setFlowState: (string: delinkScreens) => void;
}

const { paragraph, noButton, title, yesButton } = salesTaxProceed

const SalesTaxProceedModal = ({ intercomLink, salesTaxProceedModalOpen, setSalesTaxProceedModalOpen, setFlowState }: iSalesTaxProceedModal) => {
  const handleYes = () => {
    setFlowState("sales_tax_only_consent")
    setSalesTaxProceedModalOpen(false)
  };

  return (
    <Modal
      closable={true}
      includesFooter={false}
      open={salesTaxProceedModalOpen}
      setOpen={setSalesTaxProceedModalOpen}
      title={title}
    >
      <div>
        <p>
          {paragraph}
        </p>
      </div>
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between mt-1 hnry-dialog-panel-actions">
        <Button variant="primary" onClick={handleYes}>{yesButton}</Button>
        <a
          className="hnry-button hnry-button--secondary"
          href={intercomLink}
          aria-label={noButton}
          onClick={() => setSalesTaxProceedModalOpen(false)}
        >
          {noButton}
        </a>
      </div>
    </Modal>
  )
}

export default SalesTaxProceedModal
