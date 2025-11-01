import React, { useMemo, useEffect } from "react";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import Icon from "../_atoms/icons/icon/Icon";
import I18n from "../../utilities/translations";
import { trackOnClickEvent } from "./helpers/helpers";

interface SelfReconcileOptionsProps {
  onAccountTopUpClick: () => void;
  onClientPaymentClick: () => void;
  onSomethingElseClick: () => void;
  incrementIndex: () => void;
  transactionIndex: number;
  transactions: Transaction[];
  hasActiveCard: boolean;
}

const SelfReconcileOptions = ({
  onAccountTopUpClick,
  onClientPaymentClick,
  onSomethingElseClick,
  incrementIndex,
  transactionIndex,
  transactions,
  hasActiveCard,
}: SelfReconcileOptionsProps) => {
  const handleAccountTopUpClick = () => {
    onAccountTopUpClick();
    trackOnClickEvent(
      "user_reconciliation_user_selects_payment_type",
      transactions[0],
      "account_top_up",
    );
  };

  const handleClientPaymentClick = () => {
    onClientPaymentClick();
    trackOnClickEvent(
      "user_reconciliation_user_selects_payment_type",
      transactions[0],
      "select_client",
    );
  };

  const handleSomethingElseClick = () => {
    onSomethingElseClick();
    trackOnClickEvent(
      "user_reconciliation_user_selects_payment_type",
      transactions[0],
      "more_information",
    );
  };

  const options = useMemo(() => {
    const opts = [];
    if (hasActiveCard) {
      opts.push({
        title: I18n.t(
          "home.index.self_reconcile.main_modal.account_top_up.title",
        ),
        id: "account-topup",
        description: I18n.t(
          "home.index.self_reconcile.main_modal.account_top_up.description",
        ),
        onClick: handleAccountTopUpClick,
      });
    }
    opts.push(
      {
        title: I18n.t(
          "home.index.self_reconcile.main_modal.client_payment.title",
        ),
        id: "client-payment",
        description: I18n.t(
          "home.index.self_reconcile.main_modal.client_payment.description",
        ),
        onClick: handleClientPaymentClick,
      },
      {
        title: I18n.t(
          "home.index.self_reconcile.main_modal.more_information.title",
        ),
        id: "something-else",
        description: I18n.t(
          "home.index.self_reconcile.main_modal.more_information.description",
        ),
        onClick: handleSomethingElseClick,
      },
    );
    return opts;
  }, [
    hasActiveCard,
    onAccountTopUpClick,
    onClientPaymentClick,
    onSomethingElseClick,
  ]);

  useEffect(() => {
    if (transactions[transactionIndex].hasBeenReviewed) {
      incrementIndex();
    }
  }, [transactions, transactionIndex, incrementIndex]);

  return (
    <ul className="tw-mb-0 tw-divide-y tw-divide-gray-100">
      {options.map(({ title, id, description, onClick }) => (
        <li className="hover:tw-bg-gray-50" key={`card-more-action-${id}`}>
          <button
            onClick={onClick}
            type="button"
            className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-x-6 tw-py-2 tw-text-left"
          >
            <div className="tw-flex tw-min-w-0 tw-gap-x-4">
              <div className="tw-min-w-0 tw-flex-auto tw-text-gray-900">
                <p className="tw-mb-0 tw-font-semibold">{title}</p>
                {description && (
                  <p className="tw-mb-0 tw-text-xs tw-font-normal">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="tw-flex tw-items-center">
              <Icon type="ChevronRightIcon" size="base" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SelfReconcileOptions;
