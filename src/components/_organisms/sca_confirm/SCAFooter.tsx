import React from "react";
import Button from "../../_atoms/button/Button";
import I18n from "../../../utilities/translations";

interface iSCAFooter {
  /*
   * Close action is close the SCA modal without actually cancel the SCA challenge
   */
  closeAction: boolean;
  handleCancelClick: () => void;
}

const SCAFooter = ({
  closeAction,
  handleCancelClick,
}: iSCAFooter) => (
  <div className="tw-flex tw-flex-col tw-gap-y-3 tw-m-1">
    <Button onClick={handleCancelClick} variant="tertiary">
      {closeAction ? I18n.t("sca_confirm.close_button") : I18n.t("sca_confirm.cancel_button")}
    </Button>
  </div>
);

export default SCAFooter;
