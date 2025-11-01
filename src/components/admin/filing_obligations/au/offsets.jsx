import React from "react";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";
import I18n, { storeRequiredLocales } from "../../../../utilities/translations"

const offsets = ({
  spouseSuperContributions,
  spouseSuperAmount,
  livedInRemoteArea,
}) => {
  storeRequiredLocales("en-AU");
  if (spouseSuperContributions || livedInRemoteArea) {
    return (
      <Accordion baseId="offsets" title="Offsets" classes="custom-card-filing" open>
        <Table title="Offsets">
          {spouseSuperContributions && (
            <Row
              fieldName="Superannuation contributions on behalf of your spouse"
              value={`${toLocaleString(spouseSuperAmount, 0)}`}
              copyLabel="spouse-super-amount"
              code="A"
            />
          )}
          {livedInRemoteArea && (
            <Row
              fieldName={I18n.t("filing_obligations.filings.final_checks.regional_remote_zone")}
              value="Yes"
              code="R"
              warningTooltip="Contact customer for more"
            />
          )}
        </Table>
        <br />
      </Accordion>
    );
  }

  return null;
};

export default offsets;
