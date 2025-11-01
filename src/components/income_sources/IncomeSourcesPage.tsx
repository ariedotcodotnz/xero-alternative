import React from "react";
import IncomeSourceRow from "./IncomeSourceRow";
import { iIncomeSource as financialIncomeSource, iMidYearTransition } from "../../types/financialIncomeSource.type";
import I18n from "../../utilities/translations";
import PreHnryIncomeRow from "./PreHnryIncomeRow";
import { timeZoneType } from "../../types";
import isMobile from "../../es_utilities/isMobile";

interface iIncomeSourcesPage {
  tableId: string;
  incomeSources: financialIncomeSource[];
  isImpersonating: boolean;
  currentFy: string;
  timeZone: timeZoneType;
  blockSalary: boolean;
  midYearTransitionToDisplay: boolean;
  midYearTransition: iMidYearTransition;
}

const ctx = "income_sources.table.header_labels";
const IncomeSourcesPage = ({
  tableId,
  incomeSources,
  isImpersonating,
  currentFy,
  timeZone,
  blockSalary,
  midYearTransitionToDisplay,
  midYearTransition,
}: iIncomeSourcesPage) => (
  <div id={tableId} className="hui-table-wrapper">
    <table className="hui-table tw-w-full tw-mb-6">
      <thead>
        <tr>
          <th scope="col">{I18n.t("source", { scope: ctx })}</th>
          {!isMobile && <th scope="col">{I18n.t("type", { scope: ctx })}</th>}
          <th scope="col">{I18n.t("estimate", { scope: ctx })}</th>
          <th scope="col">{I18n.t("status", { scope: ctx })}</th>
          <th scope="col" className="tw-sr-only">{I18n.t("actions", { scope: ctx })}</th>
        </tr>
      </thead>
      <tbody>
        { incomeSources.map((source, index) => (
          <IncomeSourceRow
            key={index}
            incomeSource={source}
            isImpersonating={isImpersonating}
            currentFy={currentFy}
            timeZone={timeZone}
            blockSalary={blockSalary}
          />
        ))}
        { midYearTransitionToDisplay && (
          <PreHnryIncomeRow
            midYearTransition={midYearTransition}
            isImpersonating={isImpersonating}
          />
        ) }
      </tbody>
    </table>
  </div>
);

export default IncomeSourcesPage;
