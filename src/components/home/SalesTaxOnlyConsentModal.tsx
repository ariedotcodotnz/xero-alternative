import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Modal from "@hui/_molecules/modal/Modal";
import { delinkScreens } from "./types";
import { salesTaxOnlyConsent } from "./translations";

interface iSalesTaxOnlyConsentModal {
  salesTaxOnlyConsentModalOpen: boolean;
  setFlowState: (string: delinkScreens) => void;
  setSalesTaxOnlyConsentModalOpen: (boolean) => void;
}

const { button, consentLabel, contentHtml, title } = salesTaxOnlyConsent
const consentName = "sales_tax_linked_limits_acknowledged"

const SalesTaxOnlyConsentModal = ({ salesTaxOnlyConsentModalOpen, setFlowState, setSalesTaxOnlyConsentModalOpen }: iSalesTaxOnlyConsentModal) => {
  const [consentAccepted, setConsentAccepted] = useState(false)
  const handleSubmit = () => {
    setSalesTaxOnlyConsentModalOpen(false);
    setFlowState("sales_tax_linked")
  };

  const handleBack = () => {
    setSalesTaxOnlyConsentModalOpen(false)
    setFlowState("sales_tax_proceed")
  }

  return (
    <Modal
      closable={true}
      open={salesTaxOnlyConsentModalOpen}
      setOpen={setSalesTaxOnlyConsentModalOpen}
      title={title}
      includesFooter={false}
    >
      <div className="list-disc tw-prose-sm tw-prose-grey tw-pb-2" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <LabeledConsentCheckbox
        name={consentName}
        onChange={setConsentAccepted}
        label={consentLabel}
        id={consentName}
      />
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between mt-1 hnry-dialog-panel-actions">
        <Button variant="primary" disabled={!consentAccepted} onClick={handleSubmit}>{button}</Button>
        <Button variant="secondary" onClick={handleBack}>Back</Button>
      </div>
    </Modal >
  )
}

export default SalesTaxOnlyConsentModal
