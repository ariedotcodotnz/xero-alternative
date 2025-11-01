import React, { useState } from "react"
import Button from "@hui/_atoms/button/Button";
import I18n from "../../../utilities/translations";
import PayeOffBoardingModal from "./PayeOffBoardingModal";

interface iUserId {
  userId: number;
}

const PayeDroppingOffBanner = ({ userId }: iUserId) => {
  const payeCtx = "home.call_to_action.paye_dropping_off"

  const [PayeOffBoardingModalOpen, setPayeOffBoardingModalOpen] = useState(false)

  const handleYes = () => {
    // eslint-disable-next-line xss/no-location-href-assign
    window.location.href = encodeURI(Routes.income_sources_path());
  };

  return (
    <>
      <div className="alert alert-danger" role="alert">
        <h2 className="tw-text-2xl"><strong> {I18n.t("title", { scope: payeCtx })}</strong></h2>
        <p>
          {I18n.t("paragraph_html", { tax_agency: I18n.t("global.tax_collection_authority_short"), scope: payeCtx })}
        </p>
        <Button variant="primary" classes={"tw-mr-2"} onClick={handleYes}>Yes</Button>
        <Button variant="primary" classes={"tw-mt-2"} onClick={() =>
          setPayeOffBoardingModalOpen(true)
        }>No</Button>
      </div>

      {PayeOffBoardingModalOpen && (
        <PayeOffBoardingModal
          PayeOffBoardingModalOpen={PayeOffBoardingModalOpen}
          setPayeOffBoardingModalOpen={setPayeOffBoardingModalOpen}
          userId={userId}
        />
      )}
    </>
  )
}

export default PayeDroppingOffBanner
