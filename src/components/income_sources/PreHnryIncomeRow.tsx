import React, { useState } from "react";
import Icon from "@hui/_atoms/icons/icon/Icon";
import Badge from "@hui/_atoms/badge/Badge";
import Button from "@hui/_atoms/button/Button";
import I18n from "../../utilities/translations";
import { iMidYearTransition } from "../../types/financialIncomeSource.type";
import EditPreHnryIncome from "./EditPreHnryIncome";
import isMobile from "../../es_utilities/isMobile";

interface iPreHnryIncomeRow {
  midYearTransition: iMidYearTransition;
  isImpersonating: boolean;
}

const PreHnryIncomeRow = ({
  isImpersonating,
  midYearTransition,
}: iPreHnryIncomeRow) => {
  const [editPreHnryModalOpen, setEditPreHnryModalOpen] = useState(false)

  return (
    <>
      <tr>
        <td>
          <div className="tw-flex tw-items-center">
            <div className="tw-ml-2">
              {I18n.t("income_sources.pre_hnry_income.description")}
            </div>
          </div>
        </td>
        {!isMobile && <td>{I18n.t("income_sources.pre_hnry_income.income_type_label")}</td>}
        <td>{`${midYearTransition.selfEmployedIncome}`}</td>
        <td>
          <Badge
            text={I18n.t("income_sources.pre_hnry_income.status")}
            variant="gray"
          />
        </td>
        <td className="tw-flex tw-justify-end">
          <Button variant="unstyled" onClick={() => setEditPreHnryModalOpen(true)}>
            <Icon
              size="base"
              type="PencilSquareIcon"
              classes={`${isImpersonating ? "!tw-text-admin-600 tw-w-6 tw-h-6" : "!tw-text-blue-600 tw-w-6 tw-h-6"}`}
            />
          </Button>
        </td>
      </tr>
      {editPreHnryModalOpen && (
        <EditPreHnryIncome
          editPreHnryModalOpen={editPreHnryModalOpen}
          setEditPreHnryModalOpen={setEditPreHnryModalOpen} 
          isImpersonating={isImpersonating}
          midYearTransition={midYearTransition}
        />
      )}
    </>
  );
};

export default PreHnryIncomeRow;
