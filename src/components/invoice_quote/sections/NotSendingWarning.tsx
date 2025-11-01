import React from "react";
import classNames from "classnames";
import Alert from "../../_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

interface iNotSendingWarning {
  client: string;
  invoiceClientSelected: boolean;
  onModal?: boolean;
}

const NotSendingWarning = ({
  client,
  invoiceClientSelected,
  onModal = false,
}: iNotSendingWarning) => {
  if (invoiceClientSelected) return null;

  return (
    <Alert variant="warning">
      <p className={classNames("tw-mb-0", { "tw-text-sm": onModal })}>
        {`${I18n.t("invoices.form.send_to_email_disabled_warning_p1")} ${client}. `}
        {`${I18n.t("invoices.form.send_to_email_disabled_warning_p2")} ${client}: `}
        {I18n.t("invoices.form.send_to_email_disabled_warning_p3")}
      </p>
    </Alert>
  );
};

export default NotSendingWarning;
