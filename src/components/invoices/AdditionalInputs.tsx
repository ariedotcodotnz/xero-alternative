import React, { useState } from "react";
import DepositFields from "./deposit_fields";
import HidePhoneNumberField from "./hide_phone_number_field";
import HnryUIAccordion from "../_molecules/accordion/Accordion";
import Comments from "./Comments";
import PurchaseOrderField from "./purchase_order_field";

interface iAdditionalInputsProps {
  deposit: number;
  depositsNotificationDismissed: boolean;
  hidePhoneNumber: boolean;
  setDeposit: (value: number) => void;
  setHidePhoneNumber: (value: boolean) => void;
  comments: string;
  setComments: (value: string) => void;
  poNumber: string;
  setPoNumber: (value: string) => void;
  showDeposit: boolean;
  setShowDeposit: (value: boolean) => void;
}

const AdditionalInputs = ({
  deposit,
  depositsNotificationDismissed,
  setDeposit,
  hidePhoneNumber,
  setHidePhoneNumber,
  comments,
  setComments,
  poNumber,
  setPoNumber,
  showDeposit,
  setShowDeposit
}: iAdditionalInputsProps) => {
  const [open, setOpen] = useState(showDeposit);

  const handleAccordionChanging = () => {
    setOpen(!open)
    if (!open) {
      window.analytics?.track("invoice_create_edit_extra_settings_opened", { menu_selected: "additional_settings" });
    }
  }

  return (
    <HnryUIAccordion
      title="Additional Settings"
      open={open}
      onOpenChange={handleAccordionChanging}
    >
      <div className="tw-grid tw-gap-8 sm:tw-grid-cols-2">
        <Comments comments={comments} setComments={setComments} />
        <PurchaseOrderField poNumber={poNumber} setPoNumber={setPoNumber} />
        <DepositFields
          isAlertDismissed={depositsNotificationDismissed}
          deposit={deposit}
          setDeposit={setDeposit}
          showDeposit={showDeposit}
          setShowDeposit={setShowDeposit}
        />
        <HidePhoneNumberField
          hidePhoneNumber={hidePhoneNumber}
          setHidePhoneNumber={setHidePhoneNumber}
        />
      </div>
    </HnryUIAccordion>
  )};

export default AdditionalInputs;
