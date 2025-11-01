import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Modal from "@hui/_molecules/modal/Modal";
import SalesTaxOnlyConsentToAct from "@hui/consents/consent_to_act/SalesTaxOnlyConsentToAct";
import { taxAgencyAuthorisationSalesTaxLinked } from "../../API/tax_agency_authorisation.api";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";
import { salesTaxLinked } from "./translations";

interface iSalesTaxLinkedModal {
  salesTaxLinkedModalOpen: boolean;
  setFlowState: (string: delinkScreens) => void;
  setSalesTaxLinkedModalOpen: (boolean) => void;
  taxAgencyAuthorisation: taa;
}

const { button, consentLabel, title } = salesTaxLinked
const consentName = "sales_tax_linked_authority_to_act_agreed"

const SalesTaxLinkedModal = ({ salesTaxLinkedModalOpen, setFlowState, setSalesTaxLinkedModalOpen, taxAgencyAuthorisation }: iSalesTaxLinkedModal) => {
  const [consentAccepted, setConsentAccepted] = useState(false)

  const handleSubmit = async () => {
    try {
      const response = await taxAgencyAuthorisationSalesTaxLinked(taxAgencyAuthorisation.id);

      if (response.success) {
        setSalesTaxLinkedModalOpen(false);
      }
      Turbolinks.visit(window.location.href)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to update tax agency authorisation", { error });
    }
  };

  const handleBack = () => {
    setSalesTaxLinkedModalOpen(false)
    setFlowState("sales_tax_only_consent")
  }

  return (
    <Modal
      closable={true}
      open={salesTaxLinkedModalOpen}
      setOpen={setSalesTaxLinkedModalOpen}
      title={title}
      includesFooter={false}
    >
      <SalesTaxOnlyConsentToAct />
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

export default SalesTaxLinkedModal
