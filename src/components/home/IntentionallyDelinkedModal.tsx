import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Modal from "@hui/_molecules/modal/Modal";
import { taxAgencyAuthorisationIntentionallyDelinked } from "../../API/tax_agency_authorisation.api";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";
import { intentionallyDelinked } from "./translations";

interface iIntentionallyDelinkedModal {
  intentionallyDelinkedModalOpen: boolean;
  setFlowState: (string: delinkScreens) => void;
  setIntentionallyDelinkedModalOpen: (boolean) => void;
  taxAgencyAuthorisation: taa;
};

const { button, consentLabel, contentHtml, title } = intentionallyDelinked
const consentName = "intentionally_delinked_limits_acknowledged";

const IntentionallyDelinkedModal = ({ intentionallyDelinkedModalOpen, setFlowState, setIntentionallyDelinkedModalOpen, taxAgencyAuthorisation }: iIntentionallyDelinkedModal) => {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const handleSubmit = async () => {
    try {
      const response = await taxAgencyAuthorisationIntentionallyDelinked(taxAgencyAuthorisation.id);

      if (response.success) {
        setIntentionallyDelinkedModalOpen(false);
      }
      Turbolinks.visit(window.location.href);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to update tax agency authorisation", { error });
    };
  };

  const handleBack = () => {
    setIntentionallyDelinkedModalOpen(false)
    setFlowState("how_to_proceed")
  }

  return (
    <Modal
      closable={true}
      open={intentionallyDelinkedModalOpen}
      setOpen={setIntentionallyDelinkedModalOpen}
      title={title}
      includesFooter={false}
    >
      <div className="list-disc tw-prose-sm tw-prose-grey" dangerouslySetInnerHTML={{ __html: contentHtml }} />
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

export default IntentionallyDelinkedModal
