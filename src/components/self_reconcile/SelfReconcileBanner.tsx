import React from "react";
import Button from "@hui/_atoms/button/Button";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import trackReviewNowClickFromBackEnd from "@api/self_reconcile/trackReviewNowClickFromBackEnd.api";
import I18n from "../../utilities/translations";

interface SelfReconcileBannerProps {
  transactionCount: number;
  transactionIndex: number;
  transactions: Transaction[];
  buttonDisabled: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelfReconcileBanner = ({
  transactionCount,
  transactionIndex,
  transactions,
  buttonDisabled,
  setShowModal,
}: SelfReconcileBannerProps) => {
  const isSingleTransaction = transactionCount === 1;
  const ctx = { scope: "home.index.self_reconcile.banner" };

  return (
    <div
      className="alert alert-warning-banner tw-mb-2"
      style={{ borderLeftWidth: 6 }}
      role="alert"
    >
      <div className="hui-alert__body">
        <div className="hui-alert__content">
          <div className="hui-alert__content-title tw-text-2xl">
            {I18n.t("heading", {
              count: transactionCount - transactionIndex,
              noun: isSingleTransaction ? "payment" : "payments",
              ...ctx,
            })}
          </div>
          <p>
            {I18n.t("subheading", {
              noun: isSingleTransaction ? "this payment" : "these payments",
              pronoun: isSingleTransaction ? "it" : "them",
              ...ctx,
            })}
          </p>
        </div>
      </div>
      <Button
        classes="tw-mt-4"
        loading={buttonDisabled || transactions.length === 0}
        onClick={async () => {
          setShowModal(true);
          await trackReviewNowClickFromBackEnd(transactionCount);
        }}
      >
        Review now
      </Button>
    </div>
  );
};

export default SelfReconcileBanner;
