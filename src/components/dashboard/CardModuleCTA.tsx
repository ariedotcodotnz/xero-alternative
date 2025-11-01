import React from "react";
import { activateCard } from "@hui/utils/CardActivationHelper";
import CardsTnCs from "../_organisms/cards_tncs/CardsTnCs";

interface iCardModuleCTA {
  activeStatus: boolean;
  hasDeactivatedCard: boolean;
  jurisdiction: "au" | "nz" | "uk";
  showTerms: boolean;
  cta?: string;
  title?: string;
  provisioningCard?: boolean;
}

const CardModuleCTA = ({
  activeStatus,
  hasDeactivatedCard,
  jurisdiction,
  showTerms,
  cta = "Activate card",
  title = "Hnry Debit Card Terms and Conditions",
  provisioningCard = false,
}: iCardModuleCTA) => {
  const cannotActivate = () => {
    if (toastr) {
      toastr.error("Failed to activate card - Please reach out to our team");
    }
  };

  const activate = async () => {
    await activateCard();
  };

  if (!activeStatus) return null;

  if ((!hasDeactivatedCard && showTerms) || provisioningCard) {
    return (
      <CardsTnCs
        cta={cta}
        title={title}
        jurisdiction={jurisdiction}
        disabled={provisioningCard}
      />
    );
  }

  return (
    <button
      className="hnry-button hnry-button--primary tw-w-fit"
      onClick={hasDeactivatedCard ? cannotActivate : activate}
    >
      {cta}
    </button>
  );
};

export default CardModuleCTA;
