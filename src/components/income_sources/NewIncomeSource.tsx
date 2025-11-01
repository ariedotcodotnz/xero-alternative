import React, { useState } from "react";
import IncomeSourceModal from "./IncomeSourceModal";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";
import I18n from "../../utilities/translations";
import Button from "../_atoms/button/Button";
import { timeZoneType } from "../../types";

interface iNewIncomeSource {
  incomeSource: financialIncomeSource;
  isImpersonating: boolean;
  currentFy: string;
  timeZone: timeZoneType;
  blockSalary: boolean;
  emptyPage: boolean;
}

const NewIncomeSource = ({
  incomeSource,
  isImpersonating,
  currentFy,
  timeZone,
  blockSalary,
  emptyPage,
}: iNewIncomeSource) => {
  const [incomeSourceModalOpen, setIncomeSourceModalOpen] = useState(false)

  return (
    <>
      <Button variant="primary" classes={"tw-mr-2 tw-flex tw-mb-2" } iconType="PlusIcon" onClick={() => setIncomeSourceModalOpen(!incomeSourceModalOpen)}>
        {I18n.t(`income_sources.create.button_label.${emptyPage}`)}
      </Button>
      { incomeSourceModalOpen &&
        <IncomeSourceModal
          editing={false}
          incomeSourceModalOpen={incomeSourceModalOpen}
          incomeSource={incomeSource}
          setIncomeSourceModalOpen={setIncomeSourceModalOpen}
          isImpersonating={isImpersonating}
          currentFy={currentFy}
          timeZone={timeZone}
          blockSalary={blockSalary}
          setDeleteModalOpen={() => {}}
          setCurrentIncomeSource={null}
        />
      }
    </>
  );
};


export default NewIncomeSource;
