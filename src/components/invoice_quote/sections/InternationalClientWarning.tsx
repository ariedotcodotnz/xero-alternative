import React from "react";
import classNames from "classnames";
import DOMPurify from "dompurify";
import Alert from "../../_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

interface InternationalClientWarningProps {
  internationalClient?: boolean;
  onModal?: boolean;
}

const InternationalClientWarning = ({
  internationalClient,
  onModal = false,
}: InternationalClientWarningProps) => {
  if (!internationalClient) return null;

  return (
    <Alert
      variant="warning"
      title={I18n.t("invoices.form.international_client_warning_h1")}
    >
      <p className={classNames("tw-mb-0", { "tw-text-sm": onModal })}>
        {`${I18n.t("invoices.form.international_client_warning_p1")} `}
        <span
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line xss/no-mixed-html
            __html: DOMPurify.sanitize(
              I18n.t("invoices.form.international_client_warning_p2"),
            ),
          }}
        />
      </p>
    </Alert>
  );
};

export default InternationalClientWarning;
