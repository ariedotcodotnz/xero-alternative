import React, { useState } from "react";
import { createTransactionReconciliation } from "@api/self_reconcile/transaction_reconciliations";
import SelfReconcileButtons from "../SelfReconcileButtons";
import I18n from "../../../utilities/translations";

export interface AccountTopUpConfirmProps {
  handleModalProgression: (step: string) => void;
  next: string;
  previous: string;
  userReviewType: string;
  bankTransactionId: string;
  markCurrentTransactionReviewed: () => void;
}

const AccountTopUpConfirm = ({
  handleModalProgression,
  next,
  previous,
  userReviewType,
  bankTransactionId,
  markCurrentTransactionReviewed,
}: AccountTopUpConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await createTransactionReconciliation({
        userReviewType,
        bankTransactionId,
      });

      if (response.success) {
        setIsLoading(false);
        markCurrentTransactionReviewed();
        handleModalProgression(next);
      } else {
        setIsLoading(false);
        toastr.error(response.message);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to auto-reconcile bank transaction", {
          error,
        });
      }
    }
  };

  return (
    <>
      <div>
        <div className="tw-my-6 tw-text-sm">
          <p>
            {I18n.t(
              "home.index.self_reconcile.account_top_up_modal.confirm_description",
            )}
          </p>
        </div>
      </div>
      <SelfReconcileButtons
        handleConfirm={() => handleConfirm()}
        handleBack={() => handleModalProgression(previous)}
        disabledSubmit={false}
        confirmButton="Submit"
        loading={isLoading}
      />
    </>
  );
};

export default AccountTopUpConfirm;
