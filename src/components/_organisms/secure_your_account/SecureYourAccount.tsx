import React from "react";
import QRCode from "react-qr-code";
import I18n from "../../../utilities/translations";
import Icon from "../../_atoms/icons/icon/Icon";

const ctx = { scope: "signup.prompt_download" };

interface iSecureAccountPrompt {
  appStoreLink?: string;
  googlePlayLink?: string;
  qrCode: string;
}

const SecureAccountPrompt = ({
  appStoreLink,
  googlePlayLink,
  qrCode,
}: iSecureAccountPrompt) => (
  <div className="tw-flex tw-flex-col tw-justify-between tw-text-center tw-items-center">
    <span className="hui-sca__header-icon tw-bg-gray-100">
      <Icon type="FingerPrintIcon" classes="tw-text-gray-500 tw-w-6 tw-h-6" />
    </span>
    <h1 className="tw-font-semibold tw-text-base sm:tw-text-lg tw-mt-4 tw-mb-6">
      {I18n.t("title", ctx)}
    </h1>
    <p className="tw-text-gray-700 tw-text-sm tw-text-center tw-mb-6">
      {`${I18n.t("paragraph", ctx)} `}
      <a
        href={I18n.t("link_url", ctx)}
        className="hui-link"
        target="_blank"
        rel="noreferrer"
        data-track-click={JSON.stringify({ eventName: "sca_secure_account_web_article_clicked" })}
      >
        {I18n.t("link_text", ctx)}
      </a>.
    </p>

    <div className="tw-hidden sm:tw-flex tw-w-full tw-flex-col tw-items-center tw-mb-8">
      <h2 className="tw-font-semibold tw-text-base tw-mb-6">{I18n.t("scan_qr_code", ctx)}</h2>
      <QRCode value={qrCode} className="tw-h-28 tw-w-28" />
    </div>

    <div className="tw-flex tw-flex-col tw-gap-y-2 tw-w-full">
      {googlePlayLink && (
        <a
          href={googlePlayLink}
          className="hnry-button hnry-button--tertiary !tw-w-full"
          target="_blank"
          rel="noreferrer"
          data-track-click={JSON.stringify({ eventName: "sca_secure_account_google_play_btn_clicked" })}
        >
          {I18n.t("google_play", ctx)}
        </a>
      )}
      {appStoreLink && (
        <a
          href={appStoreLink}
          className="hnry-button hnry-button--tertiary !tw-w-full"
          target="_blank"
          rel="noreferrer"
          data-track-click={JSON.stringify({ eventName: "sca_secure_account_apple_app_btn_clicked" })}
        >
          {I18n.t("apple_app", ctx)}
        </a>
      )}
    </div>
  </div>
);

export default SecureAccountPrompt;
