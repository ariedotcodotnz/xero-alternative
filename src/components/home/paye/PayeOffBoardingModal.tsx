import React from "react";
import Modal from "@hui/_molecules/modal/Modal";
import { createOffBoarding } from "../../../API/off_boarding.api";
import I18n from "../../../utilities/translations";

interface iPayeOffBoardingModal {
  PayeOffBoardingModalOpen: boolean;
  setPayeOffBoardingModalOpen: (boolean) => void;
  userId: number;
}

const translationOptions = {
  scope: "home.call_to_action.paye_dropping_off.paye_dropping_off_modal",
  tax_agency: I18n.t("global.tax_collection_authority_short"),
  sales_tax: I18n.t("global.sales_tax")
}

const PayeOffBoardingModal = ({ setPayeOffBoardingModalOpen, userId }: iPayeOffBoardingModal) => {
  const handleSubmit = async () => {
    try {
      const response = await createOffBoarding({ userId, reason:"nlse" });
      if (response.success) {
        setPayeOffBoardingModalOpen(false);
        Turbolinks.visit(window.location.href)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("User unable to start offboarding process", { error });
    }
  };

  return (
    <Modal
      open
      setOpen={setPayeOffBoardingModalOpen}
      title={I18n.t("title", translationOptions)}
      confirmCTA="I understand"
      onConfirm={handleSubmit}
      cancelCTA="Back"
    >
      <div className="list-disc tw-prose-sm tw-prose-grey tw-text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: I18n.t("paragraph_1_html", translationOptions) }} />
      <div className="list-disc tw-prose-sm tw-prose-grey tw-text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: I18n.t("paragraph_2_html", translationOptions) }} />
    </Modal >
  )
}

export default PayeOffBoardingModal
