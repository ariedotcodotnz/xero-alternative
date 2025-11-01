import React from "react";
import Button from "@hui/_atoms/button/Button";
import redirectToExternalURL from "../../utilities/redirect";
import { deleteUser } from "../../API/users.api";
import I18n from "../../utilities/translations"

const BlockedButtons = () => {
  const voidUser = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(I18n.t("onboarding.all.blocked_identity.confirm_delete_account"))) {
      await deleteUser("VOID_BLOCKED");
      redirectToExternalURL(I18n.t("global.links.account_closure"));
    }
  };

  return (
    <div className="tw-flex tw-gap-4 !tw-justify-between tw-flex-col sm:tw-flex-row-reverse">
      <Button onClick={voidUser} variant="danger" classes="tw-basis-1/2-gap-4">{I18n.t("onboarding.all.blocked_identity.buttons.delete_account")}</Button>
      <a href={"/users/sign_out"} className="hnry-button hnry-button--tertiary !tw-text-brand-600 tw-basis-1/2-gap-4" >{I18n.t("onboarding.all.blocked_identity.buttons.sign_out")}</a>
    </div>
  );
};

export default BlockedButtons;
