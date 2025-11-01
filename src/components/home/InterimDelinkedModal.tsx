import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Modal from "@hui/_molecules/modal/Modal";
import { taxAgencyAuthorisationInterimDelinked } from "../../API/tax_agency_authorisation.api";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";
import { interimDelinked } from "./translations";

interface iInterimDelinkedModal {
  interimDelinkedModalOpen: boolean;
  setFlowState: (string: delinkScreens) => void;
  setInterimDelinkedModalOpen: (boolean) => void;
  taxAgencyAuthorisation: taa;
}

const { button, consentLabel, contentHtml, title } = interimDelinked
const consentName = "interim_delinked_limits_acknowledged";

const InterimDelinkedModal = ({ interimDelinkedModalOpen, setFlowState, setInterimDelinkedModalOpen, taxAgencyAuthorisation }: iInterimDelinkedModal) => {
  const [consentAccepted, setConsentAccepted] = useState(false)
  const handleSubmit = async () => {
    try {
      const response = await taxAgencyAuthorisationInterimDelinked(taxAgencyAuthorisation.id);

      if (response.success) {
        setInterimDelinkedModalOpen(false);
        setFlowState("interim_confirmation")
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to update tax agency authorisation", { error });
    }
  };

  const handleBack = () => {
    setInterimDelinkedModalOpen(false)
    setFlowState("how_to_proceed")
  }

  return (
    <Modal
      closable={true}
      open={interimDelinkedModalOpen}
      setOpen={setInterimDelinkedModalOpen}
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

export default InterimDelinkedModal
