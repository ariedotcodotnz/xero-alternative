import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button";
import Modal from "@hui/_molecules/modal/Modal";
import RadioButtonGroup from "@hui/_molecules/radio_button_group/RadioButtonGroup";
import { taxAgencyAuthorisationOffBoardUser } from "../../API/tax_agency_authorisation.api";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";
import { offBoardUser } from "./translations";

type offBoardReasons = "nlse" | "alt_arrangement" | "overseas_resident" | "graduated";
interface iOffBoardUserModal {
  offBoardUserModalOpen: boolean;
  setFlowState: (string: delinkScreens) => void;
  setOffBoardUserModalOpen: (boolean) => void;
  taxAgencyAuthorisation: taa;
}

const { button, title, radioButton } = offBoardUser

const offBoardOptions = [
  {
    description: radioButton.overseasResident,
    name: "",
    optionId: "overseas_resident"
  },
  {
    description: radioButton.nlse,
    name: "",
    optionId: "nlse"
  },
  {
    description: radioButton.altArrangement,
    name: "",
    optionId: "alt_arrangement"
  },
  {
    description: radioButton.graduated,
    name: "",
    optionId: "graduated"
  },
]

const OffBoardUserModal = ({ offBoardUserModalOpen, setFlowState, setOffBoardUserModalOpen, taxAgencyAuthorisation }: iOffBoardUserModal) => {
  const [offBoardReason, setOffBoardReason] = useState<offBoardReasons>();
  const handleSubmit = async () => {
    try {
      const response = await taxAgencyAuthorisationOffBoardUser(taxAgencyAuthorisation.id, offBoardReason);

      if (response.success) {
        setOffBoardUserModalOpen(false);
      }
      Turbolinks.visit(window.location.href)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to update tax agency authorisation", { error });
    }
  };

  const handleBack = () => {
    setOffBoardUserModalOpen(false)
    setFlowState("continue_with_hnry")
  }

  return (
    <Modal
      closable={true}
      open={offBoardUserModalOpen}
      setOpen={setOffBoardUserModalOpen}
      title={title}
      includesFooter={false}
    >
      <RadioButtonGroup 
        options={offBoardOptions} 
        onChange={(v: offBoardReasons) => setOffBoardReason(v)}
      />
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between mt-1 hnry-dialog-panel-actions">
        <Button variant="primary" onClick={handleSubmit}>{button}</Button>
        <Button variant="secondary" onClick={handleBack}>Back</Button>
      </div>
    </Modal >
  )
}

export default OffBoardUserModal
