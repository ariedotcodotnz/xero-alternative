import React, { useMemo } from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import I18n from "../../../utilities/translations";
import { useCardManagementCallback } from "./Helper";

interface MoreActionsProps {
  appleWalletLink?: string;
  googleWalletLink?: string;
  applicationSettingOff: boolean;
  platformIsAndroid: boolean;
  platformIsIos: boolean;
  onWithdrawFundsClick: () => void;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  hnryAccountBalanceFeature: boolean;
}

const MoreActions = ({
  appleWalletLink,
  googleWalletLink,
  applicationSettingOff,
  platformIsAndroid,
  platformIsIos,
  onWithdrawFundsClick,
  reloadTrigger,
  setReloadTrigger,
  hnryAccountBalanceFeature,
}: MoreActionsProps) => {
  const { alreadyInWallet, showApplePay, showGooglePay } =
    useCardManagementCallback(reloadTrigger, setReloadTrigger);
  const cardManagementCallback = window.CardManagementCallback;
  const walletLinkRequired =
    (applicationSettingOff && !platformIsAndroid && !platformIsIos) ||
    !cardManagementCallback;
  const ukJurisdiction = window.Hnry.User.jurisdiction.code === "uk";

  const options = useMemo(
    () => [
      ...(!hnryAccountBalanceFeature
        ? [
            {
              title: I18n.t("home.hnry_card.withdraw_funds.title"),
              id: "withdrawal",
              description: I18n.t("home.hnry_card.withdraw_funds.subtext"),
              onClick: () => onWithdrawFundsClick(),
              eventName: "dashboard_card_more_withdraw_funds_click",
            },
          ]
        : []),
      {
        title: I18n.t("home.hnry_card.transactions.title"),
        id: "transactions",
        description: I18n.t("home.hnry_card.transactions.description"),
        url: Routes.cards_card_transactions_path(),
        target: false,
        eventName: "dashboard_card_more_transactions_click",
      },
      ...(!ukJurisdiction
        ? [
            {
              title: I18n.t("home.hnry_card.card_statements.title"),
              id: "statements",
              description: I18n.t("home.hnry_card.card_statements.subtext"),
              url: Routes.reports_path(),
              target: false,
              eventName: "dashboard_card_more_reports_click",
            },
          ]
        : []),
      ...(appleWalletLink &&
      ((!alreadyInWallet && showApplePay) ||
        (platformIsIos && !alreadyInWallet && applicationSettingOff) ||
        walletLinkRequired)
        ? [
            {
              title: I18n.t("home.hnry_card.apple_wallet.title"),
              id: "add-apple-wallet",
              url: appleWalletLink,
              target: true,
              eventName: "dashboard_card_more_apple_wallet_click",
            },
          ]
        : []),
      ...(googleWalletLink &&
      ((!alreadyInWallet && showGooglePay) ||
        (platformIsAndroid && !alreadyInWallet && applicationSettingOff) ||
        walletLinkRequired)
        ? [
            {
              title: I18n.t("home.hnry_card.google_wallet.title"),
              id: "add-google-wallet",
              url: googleWalletLink,
              target: true,
              eventName: "dashboard_card_more_google_wallet_click",
            },
          ]
        : []),
    ],
    [
      alreadyInWallet,
      appleWalletLink,
      applicationSettingOff,
      cardManagementCallback,
      googleWalletLink,
      onWithdrawFundsClick,
      platformIsAndroid,
      platformIsIos,
      showApplePay,
      showGooglePay,
    ],
  );

  return (
    <ul className="tw-mb-0 tw-divide-y tw-divide-gray-100">
      {options.map(
        ({ title, id, description, url, onClick, target, eventName }) => (
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
                href={url}
                data-track-click={JSON.stringify({ eventName })}
                className="tw-flex tw-items-center tw-justify-between tw-gap-x-6 tw-py-2"
                target={target ? "_blank" : undefined}
                rel={target ? "noreferrer" : undefined}
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
        ),
      )}
    </ul>
  );
};

export default MoreActions;
