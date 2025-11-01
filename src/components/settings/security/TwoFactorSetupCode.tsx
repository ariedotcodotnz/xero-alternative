import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import CopyButton from "../../_molecules/copy_button/CopyButton";
import Loader from "../../inputs/_elements/loader";
import I18n from "../../../utilities/translations";

interface iTwoFactorSetupCode {
  code?: string;
  otpSecret?: string;
}

const TwoFactorSetupCode = ({
  otpSecret = "",
  code = "",
}: iTwoFactorSetupCode) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (otpSecret && code) {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [otpSecret, code]);

  return (
    <div className="tw-flex tw-items-center tw-flex-col">
      {loading ? <div className="tw-my-12"><Loader /></div> : (
        <>
          <p>
            {I18n.t(
              "users.security.enable_two_factor_modal.two_factor_setup_code.paragraph_1",
            )}
          </p>
          <div className="tw-bg-gray-100 tw-p-6 tw-flex tw-justify-center tw-w-full">
            <div className="tw-bg-white tw-p-4">
              <QRCode value={code} className="tw-h-36 tw-w-36" />
            </div>
          </div>
          <div className="tw-flex tw-flex-col tw-mt-4 tw-w-full">
            <p className="tw-text-left">
              {I18n.t(
                "users.security.enable_two_factor_modal.two_factor_setup_code.paragraph_2",
              )}
            </p>
            <div className="tw-flex tw-justify-center">
              <CopyButton copyValue={otpSecret} label="Otp secret">
                <span className="tw-text-sm tw-pr-4 md:tw-text-lg">
                  {otpSecret}
                </span>
              </CopyButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetupCode;
