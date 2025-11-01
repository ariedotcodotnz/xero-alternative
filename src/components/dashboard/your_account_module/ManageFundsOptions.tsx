import React, { useMemo } from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import I18n from "../../../utilities/translations";

interface ManageFundsOptionsProps {
  onAddFundsAutomaticallyClick: () => void;
  onAddFundsViaBankTransferClick: () => void;
  onWithdrawFundsClick: () => void;
}

const ManageFundsOptions = ({
  onAddFundsAutomaticallyClick,
  onAddFundsViaBankTransferClick,
  onWithdrawFundsClick,
}: ManageFundsOptionsProps) => {
  const options = useMemo(
    () => [
      {
        title: I18n.t(
          "home.account_balance.manage_funds.auto_add_funds.option.title",
        ),
        id: "auto-add",
        description: I18n.t(
          "home.account_balance.manage_funds.auto_add_funds.option.description",
        ),
        onClick: () => onAddFundsAutomaticallyClick(),
        eventName: "manage_funds_add_funds_automatically_click",
      },
      {
        title: I18n.t(
          "home.account_balance.manage_funds.bank_transfer.option.title",
        ),
        id: "bank-transfer-add",
        description: I18n.t(
          "home.account_balance.manage_funds.bank_transfer.option.description",
        ),
        onClick: () => onAddFundsViaBankTransferClick(),
        eventName: "manage_funds_add_funds_via_bank_transfer_click",
      },
      {
        title: I18n.t(
          "home.account_balance.manage_funds.withdraw_funds.option.title",
        ),
        id: "withdrawal",
        description: I18n.t(
          "home.account_balance.manage_funds.withdraw_funds.option.description",
        ),
        onClick: () => onWithdrawFundsClick(),
        eventName: "manage_funds_withdraw_funds_click",
      },
    ],
    [
      onAddFundsAutomaticallyClick,
      onAddFundsViaBankTransferClick,
      onWithdrawFundsClick,
    ],
  );

  return (
    <ul className="tw-mb-0 tw-divide-y tw-divide-gray-100">
      {options.map(({ title, id, description, onClick, eventName }) => (
        <li className="hover:tw-bg-gray-50" key={`card-more-action-${id}`}>
          {onClick ? (
            <button
              onClick={onClick}
              className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-x-6 tw-py-2 tw-text-left"
              data-track-click={JSON.stringify({ eventName })}
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
          ) : (
            <a
              data-track-click={JSON.stringify({ eventName })}
              className="tw-flex tw-items-center tw-justify-between tw-gap-x-6 tw-py-2"
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
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ManageFundsOptions;
