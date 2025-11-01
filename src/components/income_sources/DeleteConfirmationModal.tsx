import React from "react";
import Modal from "@hui/_molecules/modal/Modal";
import Button from "@hui/_atoms/button/Button";
import I18n from "../../utilities/translations";
import { deleteIncomeSource } from "../../API/financial_income_source.api";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";

interface iDeleteConfirmationModal {
  deleteModalOpen: boolean;
  incomeSource: financialIncomeSource;
  setIncomeSourceModalOpen: (boolean) => void;
  setDeleteModalOpen: (boolean) => void;
  setCurrentIncomeSource: (boolean) => void;
}

const ctx = "income_sources";

const DeleteConfirmationModal = ({
  deleteModalOpen,
  incomeSource,
  setIncomeSourceModalOpen,
  setDeleteModalOpen,
  setCurrentIncomeSource,
}: iDeleteConfirmationModal) => {

  const deleteFinancialIncomeSource = async() => {
    try {
      const response = await deleteIncomeSource(incomeSource.id)

      const { data, error } = response;

      if (error) {
        toastr.error(error.error[0].error);
      } else {
        toastr.success(data.message);
        setCurrentIncomeSource(null);
        setIncomeSourceModalOpen(false);
        setDeleteModalOpen(false);
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Income source deletion failed", error)
    }
  }

  return (
    <Modal
      closable={false}
      open={deleteModalOpen}
      setOpen={setDeleteModalOpen}
      title={I18n.t("delete.title", { scope: ctx })}
      includesFooter={false}
      id="delete-confirmation-modal"
    >
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between tw-mt-4 hnry-dialog-panel-actions">
        <Button variant="danger" onClick={deleteFinancialIncomeSource}>
          {I18n.t("delete.delete_button", { scope: ctx })}
        </Button>
        <Button variant="secondary" onClick={ () => setDeleteModalOpen(!deleteModalOpen)}>
          {I18n.t("modal.cancel", { scope: ctx })}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
