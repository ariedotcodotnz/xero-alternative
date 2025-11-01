import React, { useEffect, useState } from "react";
import forge from "node-forge";
import OtpCodeInput from "../../_atoms/otp_input/OtpInput";
import { get, postJson } from "../../../API/config/fetch.api";
import { decryptRSAOAEP } from "../../../utilities/cryptography/rsa";
import { decryptPKCS7CBC } from "../../../utilities/cryptography/aes";

export interface iAuthModal {
  setCardDetails: (cardDetails: object) => void;
  sendSMS: () => void;
  authenticatorApp?: boolean;
  userEmail?: string;
  jurisdiction: string;
}

const AuthModal = ({
  setCardDetails,
  authenticatorApp,
  userEmail,
  sendSMS,
  jurisdiction,
}: iAuthModal) => {
  const [otpCode, setOtpCode] = useState("");

  const generateRsaKeys = () => {
    const keyPair = forge.pki.rsa.generateKeyPair(2048);
    const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    const publicKeyDerBin = forge.pki.pemToDer(publicKey).getBytes();
    const publicKeyDer64 = forge.util.encode64(publicKeyDerBin);

    return {
      keyPair,
      publicKeyDer64,
    };
  };

  const decryptData = (keyPair, data) => {
    if (data == null) return {};

    const dataObject = JSON.parse(forge.util.decode64(data));

    // IV hex to bytes
    const aesIV = dataObject.iv;
    const aesIVBytes = forge.util.hexToBytes(aesIV);

    // Decrypt AES Key
    const aesKeyEncrypted = dataObject.encryption_key;
    const aesKeyEncryptedBytes = forge.util.hexToBytes(aesKeyEncrypted);
    const aesKeyInBytes = decryptRSAOAEP(
      aesKeyEncryptedBytes,
      keyPair.privateKey,
    );

    // Decrypt Data
    const encryptedData = dataObject.encrypted_data;
    const encryptedDataByteBuffer = forge.util.createBuffer(
      forge.util.hexToBytes(encryptedData),
    );
    const cardData = JSON.parse(
      decryptPKCS7CBC({
        key: aesKeyInBytes,
        initializationVector: aesIVBytes,
        encryptedBytes: encryptedDataByteBuffer,
      }),
    );

    return {
      card_number: cardData?.pan,
      cvv: cardData?.security_data?.security_code_2,
    };
  };

  const sendOtp = () => {
    get(Routes.send_cards_mfa_cards_path())
      .then((response) => {
        if (response.message) {
          toastr.success(response.message);
        }
      })
      .catch(() => {
        toastr.error("Failed to send MFA code");
      });
  };

  useEffect(() => {
    sendOtp();
  }, []);

  const submitOtp = (otp: string) => {
    const keys = generateRsaKeys();

    postJson(
      Routes.card_details_cards_path(),
      JSON.stringify({ token: otp, public_key: keys.publicKeyDer64 }),
    )
      .then((response) => {
        let cardDetails = JSON.parse(response.card_details);

        if (response.encrypted_card_details != null) {
          const decryptedCardDetails = decryptData(
            keys.keyPair,
            response.encrypted_card_details,
          );
          cardDetails = $.extend(true, cardDetails, decryptedCardDetails);
        }

        setCardDetails(cardDetails);
        if (jurisdiction != "uk") sendSMS();
      })
      .catch(() => {
        toastr.error("Incorrect code entered, please try again");
      });
  };

  const handleOtpChange = (otp: string) => {
    setOtpCode(otp);
    if (otp.length === 6) {
      submitOtp(otp);
    }
  };

  return (
    <div>
      <div className="tw-mb-5">
        {authenticatorApp ? (
          <p className="tw-mb-5">Enter the code from your authenticator app</p>
        ) : (
          <p className="tw-mb-0">
            We sent an MFA code to: <strong>{userEmail}</strong>
          </p>
        )}
      </div>
      <div className="tw-mx-0 tw-my-6 tw-px-0 tw-py-2 sm:tw-px-6">
        <OtpCodeInput
          value={otpCode}
          inputName="otp_code"
          onChange={handleOtpChange}
        />
      </div>
    </div>
  );
};

export default AuthModal;
