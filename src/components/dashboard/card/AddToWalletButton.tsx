import React, { forwardRef } from "react";
import { handleManageCardClick } from "./Helper";

export interface iAddToWalletButton {
  applePay?: boolean;
  googlePayMarkPath?: string;
  applePayMarkPath?: string;
}

const AddToWalletButton = forwardRef<HTMLButtonElement, iAddToWalletButton>(
  ({ applePay, googlePayMarkPath, applePayMarkPath }, ref) => {
    const defaultButtonStyles = "tw-bg-transparent tw-text-gray-800";

    return (
      <div className="tw-w-full tw-px-4 tw-pb-6">
        <div className="tw-flex tw-flex-row tw-justify-evenly">
          <button
            type="button"
            className={defaultButtonStyles}
            onClick={handleManageCardClick}
            ref={ref}
          >
            {applePay && (
              <div className="tw-px-1">
                <img
                  src={applePayMarkPath}
                  alt="Apple Pay Mark"
                  className="tw-h-10 tw-object-cover"
                  data-testid="applePayMark"
                />
              </div>
            )}
            {!applePay && (
              <div className="tw-px-1">
                <img
                  src={googlePayMarkPath}
                  alt="Google Pay Mark"
                  className="tw-h-10 tw-object-cover"
                  data-testid="googlePayMark"
                />
              </div>
            )}
          </button>
        </div>
      </div>
    );
  },
);

AddToWalletButton.displayName = "Add to Wallet Button";

export default AddToWalletButton;
