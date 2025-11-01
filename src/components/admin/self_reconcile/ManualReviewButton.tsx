import React, { useState } from "react";
import Button from "../../_atoms/button/Button";
import { updateBankTransaction } from "../../../admin/API/bank_transactions.api";

export interface iManualReviewButton {
  bankTransactionId: string;
  buttonText: string;
}

const ManualReviewButton = ({
  bankTransactionId,
  buttonText,
}: iManualReviewButton) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await updateBankTransaction({ bankTransactionId });

      if (response.status === "ok") {
        setIsLoading(false);
        setIsDisabled(true);
        toastr.success("Payment sent for manual review");
      } else {
        setIsLoading(false);
        toastr.error("Failed to send payment for manual review");
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("Unable to send transaction for manual review", { error });
      }
    }
  };

  return (
    <>
      <Button classes="!tw-px-3" onClick={handleClick} disabled={isDisabled} variant="primary" dataTestId="manual-review-button" loading={isLoading}>
        <span>{buttonText}</span>
      </Button>
    </>
  );
}

export default ManualReviewButton;
