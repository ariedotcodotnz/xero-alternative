import React  from "react";
import Accordion from "@hui/_molecules/accordion/Accordion";
import I18n from "../../../utilities/translations";

const ctx = { scope: "users.security.login_settings" };

interface iLoginSettings {
  oauthRegisteredOnly: boolean;
}

const LoginSettingss = ({
  oauthRegisteredOnly,
}: iLoginSettings) => {
  const copy = oauthRegisteredOnly ? I18n.t("set_password", ctx) : I18n.t("reset_password", ctx);

  return (
    <Accordion
      title={I18n.t("title", ctx)}
      open={false}
    >
      <h2 className="tw-font-semibold tw-text-base">{copy}</h2>
      <p className="tw-text-gray-700 tw-mb-8">{I18n.t("intro", ctx)}</p>
      <a href={Routes.edit_user_registration_path()} className="hnry-button hnry-button--primary">
        {copy}
      </a>
    </Accordion>
  );
};

export default LoginSettingss;
