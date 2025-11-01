import React from "react";
import { useCardManagementCallback } from "./Helper";
import AddToWalletButton from "./AddToWalletButton";

export interface iAddToWalletButtonWrapper {
  googlePayMarkPath?: string;
  applePayMarkPath?: string;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const AddToWalletButtonWrapper = ({
  googlePayMarkPath,
  applePayMarkPath,
  reloadTrigger,
  setReloadTrigger,
}: iAddToWalletButtonWrapper) => {
  const { alreadyInWallet, showApplePay, showGooglePay } =
    useCardManagementCallback(reloadTrigger, setReloadTrigger);

  const renderText = () => {
    if (alreadyInWallet) {
      if (showApplePay) {
        return "Card available in Apple Wallet";
      }
      if (showGooglePay) {
        return "Card available in Google Wallet";
      }
      return "Card available in Wallet";
    }
  };

  return (
    <div>
      {alreadyInWallet && (
        <div className="tw-flex tw-w-full tw-justify-evenly tw-px-4 tw-pb-6">
          <div className="tw-py-1 tw-text-sm tw-font-light">{renderText()}</div>
        </div>
      )}
      {!alreadyInWallet && showApplePay && (
        <AddToWalletButton applePay applePayMarkPath={applePayMarkPath} />
      )}
      {!alreadyInWallet && showGooglePay && (
        <AddToWalletButton
          applePay={false}
          googlePayMarkPath={googlePayMarkPath}
        />
      )}
    </div>
  );
};

export default AddToWalletButtonWrapper;
