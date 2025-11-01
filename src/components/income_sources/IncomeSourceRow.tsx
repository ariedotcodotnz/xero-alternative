import React, { useState } from "react";
import Icon from "../_atoms/icons/icon/Icon";
import Badge from "../_atoms/badge/Badge";
import Button from "../_atoms/button/Button";
import Logo from "../../../assets/images/ird_small.svg";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";
import IncomeSourceModal from "./IncomeSourceModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import I18n from "../../utilities/translations";
import { timeZoneType } from "../../types";
import isMobile from "../../es_utilities/isMobile";

interface iIncomeSourceRow {
  incomeSource: financialIncomeSource;
  isImpersonating: boolean;
  currentFy: string;
  timeZone: timeZoneType;
  blockSalary: boolean;
}

const IncomeSourceRow = ({
  incomeSource,
  isImpersonating,
  currentFy,
  timeZone,
  blockSalary,
}: iIncomeSourceRow) => {
  const statusColor = (status) => {
    switch (status) {
    case "Unconfirmed":
      return "amber";
    case "Pending": 
      return "blue";
    case "Active":
      return "green";
    default: 
      return "gray";
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [incomeSourceModalOpen, setIncomeSourceModalOpen] = useState(false)
  const [currentIncomeSource, setCurrentIncomeSource] = useState(incomeSource)

  return (
    <>
      {currentIncomeSource &&
        <tr id={`income-source_${incomeSource.id}`}>
          <td>
            <div className="tw-flex tw-items-center">
                { currentIncomeSource.reconcilable && (
                <img src={Logo} alt="IRD Logo" className="inline-block" style={{ height: 22, width: 22 }} />
                )}
              <div className="tw-ml-2">
                {currentIncomeSource.description}
              </div>
            </div>
          </td>
          {!isMobile && <td>{currentIncomeSource.incomeSource.name}</td>}
          <td>{`${currentIncomeSource.estimate}`}</td>
          <td>
            <Badge
              text={currentIncomeSource.status}
              variant={statusColor(currentIncomeSource.status)}
            />
          </td>
          <td className="tw-flex tw-justify-end">
            { currentIncomeSource.status === "Unconfirmed" ?
              <Button variant="danger" size="tiny" onClick={() => setIncomeSourceModalOpen(!incomeSourceModalOpen)}>
                {I18n.t("income_sources.modal.review_button")}
              </Button>
              :
              <Button variant="unstyled" onClick={() => setIncomeSourceModalOpen(!incomeSourceModalOpen)}>
                <span className="tw-sr-only">Edit income source</span>
                <Icon
                  size="base"
                  type="PencilSquareIcon"
                  classes={`${isImpersonating ? "!tw-text-admin-600 tw-w-6 tw-h-6" : "!tw-text-blue-600 tw-w-6 tw-h-6"}`}
                />
              </Button>
            }
          </td>
          {incomeSourceModalOpen &&
            <IncomeSourceModal
              editing={true}
              incomeSourceModalOpen={incomeSourceModalOpen}
              incomeSource={currentIncomeSource}
              setIncomeSourceModalOpen={setIncomeSourceModalOpen}
              isImpersonating={isImpersonating}
              currentFy={currentFy}
              timeZone={timeZone}
              blockSalary={blockSalary}
              setDeleteModalOpen={setDeleteModalOpen}
              setCurrentIncomeSource={setCurrentIncomeSource}
            />
          }
          {deleteModalOpen &&
            <DeleteConfirmationModal
              deleteModalOpen={deleteModalOpen}
              incomeSource={incomeSource}
              setIncomeSourceModalOpen={setIncomeSourceModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
              setCurrentIncomeSource={setCurrentIncomeSource}
            />
          }
        </tr>
      }
    </>
  )
};

export default IncomeSourceRow;
