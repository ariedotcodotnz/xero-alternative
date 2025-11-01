import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import ConsentToAct from "@hui/consents/consent_to_act/ConsentToAct";
import Modal from "@hui/_molecules/modal/Modal";
import { taxAgencyAuthorisationLinked } from "../../API/tax_agency_authorisation.api";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";
import { linked } from "./translations";

interface iLinkedModal {
  linkedModalOpen: boolean;
  setFlowState?: (string: delinkScreens) => void;
  setLinkedModalOpen: (boolean) => void;
  taxAgencyAuthorisation: taa;
};

const { button, consentLabel, title } = linked
const consentName = "consent_to_act_agreed";

const LinkedModal = ({ linkedModalOpen, setFlowState, setLinkedModalOpen, taxAgencyAuthorisation }: iLinkedModal) => {
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await taxAgencyAuthorisationLinked(taxAgencyAuthorisation.id);

      if (response.success) {
        setLinkedModalOpen(false);
      }
      Turbolinks.visit(window.location.href)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to update tax agency authorisation", { error });
    };
  };

  const handleBack = () => {
    setLinkedModalOpen(false)
    if (setFlowState) {
      setFlowState("allow_to_relink")
    }
  }

  return (
    <Modal
      closable={true}
      open={linkedModalOpen}
      setOpen={setLinkedModalOpen}
      title={title}
      includesFooter={false}
    >
      <ConsentToAct />
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

export default LinkedModal
