import React from "react";
import { getUserJurisdictionLocale } from "../../../utilities/user_attributes";

interface iOpeningParagraph {
  endDate?: InstanceType<typeof Date>;
  invoiceLocation: string;
  invoiceNumber: string;
  startDate?: InstanceType<typeof Date>;
}

// Opening paragraph with all the general details of the invoice
// that would go in the email body
const OpeningParagraph = ({
  endDate,
  invoiceLocation,
  invoiceNumber,
  startDate,
}: iOpeningParagraph) => (
  <>
    <p className="invoice-quote-email-text">
      Please find {invoiceLocation} {invoiceNumber}
      {(startDate && endDate) && (
        <span>
          {` for the period of ${startDate.toLocaleDateString(getUserJurisdictionLocale())} to ${endDate.toLocaleDateString(getUserJurisdictionLocale())}`}
        </span>
      )}.
    </p>
  </>
);

export default OpeningParagraph;
