/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from "react"
import Button from "@hui/_atoms/button/Button";
import Icon from "@hui/_atoms/icons/icon/Icon";
import Input from "@hui/_atoms/input/Input";
import Modal from "@hui/_molecules/modal/Modal";
import Select from "@hui/_atoms/select/Select";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import AmountsAndDates from "./AmountsAndDates";
import ReconciledIncomeSourceConfirmation from "./ReconciledIncomeSourceConfirmation"
import TaxRateConsentModal from "./TaxRateConsentModal";
import I18n from "../../utilities/translations";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";
import { updateIncomeSource, createIncomeSource } from "../../API/financial_income_source.api";
import { timeZoneType } from "../../types/index.js";

const SALARY_TYPE = "PAYE/Salary"

interface iIncomeSourceModal {
  incomeSourceModalOpen: boolean;
  setIncomeSourceModalOpen: (boolean) => void;
  setDeleteModalOpen: (boolean) => void;
  setCurrentIncomeSource: (string) => void;
  incomeSource: financialIncomeSource;
  isImpersonating: boolean;
  currentFy: string;
  editing: boolean;
  timeZone: timeZoneType;
  blockSalary: boolean;
}

const IncomeSourceModal = ({
  incomeSourceModalOpen,
  incomeSource,
  isImpersonating,
  setIncomeSourceModalOpen,
  setDeleteModalOpen,
  setCurrentIncomeSource,
  currentFy,
  editing,
  timeZone,
  blockSalary,
}: iIncomeSourceModal) => {
  const initialState = {
    description: incomeSource.description || "",
    frequency: incomeSource.frequency || null,
    recurringAmount: incomeSource.recurringAmount || "",
    startOn: incomeSource.startOn || "",
    endOn: incomeSource.endOn || "",
    continueToEarn: incomeSource.needsReview ? "" : incomeSource.continuing.toString(),
    estimateCorrect: "",
    startedThisYearSwitchEnabled: incomeSource.startedThisYear,
    fixedEndDateSwitchEnabled: incomeSource.endOn !== null,
    selectedIncomeSource: incomeSource.incomeSource
  }

  const [editableIncomeSource, setEditableIncomeSource] = useState(initialState)
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [taxRateConsent, setTaxRateConsent] = useState(false)
  const [taxRateConsentModalOpen, setTaxRateConsentModalOpen] = useState(false)

  const ctx = "income_sources.modal";

  const payload = {
    financial_income_source: {
      description: editableIncomeSource.description,
      frequency: editableIncomeSource.frequency,
      recurring_amount: editableIncomeSource.recurringAmount,
      starts_during_current_fy: editableIncomeSource.startedThisYearSwitchEnabled,
      start_on: editableIncomeSource.startOn || currentFy,
      ending: editableIncomeSource.fixedEndDateSwitchEnabled,
      end_on: editableIncomeSource.endOn,
      income_source_id: editableIncomeSource.selectedIncomeSource.id,
      use_payor_declared_year_to_date_amount: !(editableIncomeSource.continueToEarn === "true"),
      user_confirming: editableIncomeSource.estimateCorrect === "1",
    },
    tax_rate_consent: taxRateConsent
  }

  const incomeSourceTypeOptions = useMemo(() => (
    incomeSource.incomeSourceTypes.map((incomeType) => ({
      name: incomeType.name, value: incomeType.id, id: incomeType.id,
    }))
  ), [incomeSource.incomeSourceTypes]);

  useEffect(() => {
    if (
      editableIncomeSource.frequency !== null &&
      editableIncomeSource.description.length > 0 &&
      editableIncomeSource.recurringAmount !== "0.00" &&
      (!incomeSource.needsReview || editableIncomeSource.continueToEarn !== "") &&
      (!editableIncomeSource.fixedEndDateSwitchEnabled || (editableIncomeSource.fixedEndDateSwitchEnabled && editableIncomeSource.endOn !== "")) &&
      (!editableIncomeSource.startedThisYearSwitchEnabled || (editableIncomeSource.startedThisYearSwitchEnabled && editableIncomeSource.startOn !== "")) &&
      ((editableIncomeSource.continueToEarn === "false") || (editableIncomeSource.continueToEarn === "true" && (editableIncomeSource.estimateCorrect !== "" || !incomeSource.needsReview))) &&
      (editableIncomeSource.frequency !== "once" || (editableIncomeSource.frequency === "once" && editableIncomeSource.startOn !== ""))
    ) {
      setSubmitDisabled(false);
    }
    else (
      setSubmitDisabled(true)
    )
  }, [editableIncomeSource]);

  const resetForm = () => {
    setIncomeSourceModalOpen(false)
    !editing && setEditableIncomeSource(initialState)
  }

  const confirmIncomeSource = () => {
    if (JSON.stringify(editableIncomeSource) === JSON.stringify(initialState)) {
      setIncomeSourceModalOpen(false)
    } else {
      setTaxRateConsentModalOpen(true)
    }
  }

  const submitIncomeSource = async () => {
    try {
      let response;

      if (editing) {
        response = await updateIncomeSource(incomeSource.id, payload)
      } else {
        response = await createIncomeSource(payload)
      }

      const { data, error } = response

      if (error) {
        toastr.error(error.error[0].error)
      } else if (editing) {
        toastr.success(data.message);
        setIncomeSourceModalOpen(false)
        setCurrentIncomeSource(data.financial_income_source)
      } else {
        toastr.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Income source update failed", error)
    }
  }

  const handleChangeIncomeSouceType = (value: string) => {
    const selected = incomeSource.incomeSourceTypes.find((obj) => obj.id === value);
    const newValues = blockSalary && selected.name === SALARY_TYPE ? { selectedIncomeSource: selected, frequency: null, recurringAmount: null } : { selectedIncomeSource: selected }

    selected && setEditableIncomeSource((prev) => ({ ...prev, ...newValues }))
  };

  const modalTitle = () => {
    const title = editing ? I18n.t(`title.edit.${isImpersonating ? "admin" : "user"}`, { scope: ctx }) : I18n.t("title.new", { scope: ctx });

    return title;
  };

  const shouldAllowIncomeSource = () => {
    const payeBlockedSalary = blockSalary ? editableIncomeSource.selectedIncomeSource.name !== SALARY_TYPE : true

    return payeBlockedSalary
  };
  return (
    <>
      <Modal
        closable={false}
        open={incomeSourceModalOpen}
        setOpen={setIncomeSourceModalOpen}
        title={modalTitle()}
        onCancel={resetForm}
        cancelCTA={I18n.t("cancel", { scope: ctx })}
        onConfirm={confirmIncomeSource}
        confirmCTA={incomeSource.reconcilable ? I18n.t("confirm", { scope: ctx }) : I18n.t("save", { scope: ctx })}
        disabled={submitDisabled}
      >
        <div className="tw-mb-6">
          {!incomeSource.reconcilable && (
            <label className="hnry-label" htmlFor="financial_income_source[description]">
              <span className="tw-flex tw-items-center tw-gap-x-1 tw-pt-2 hnry-label hnry-label--required">
                {I18n.t("description_text", { scope: ctx })}
                <Tooltip popoverMessage={I18n.t("tooltip", { scope: ctx })} size="sm" />
              </span>
            </label>
          )}
          <Input
            name="financial_income_source[description]"
            inputClasses="tw-mb-4 after:tw-content-['*'] after:tw-text-red"
            key="description-field"
            disabled={incomeSource.reconcilable}
            label="Income Source"
            setValue={(value) => setEditableIncomeSource(prev => ({ ...prev, description: value }))}
            labelRendered={incomeSource.reconcilable}
            defaultValue={editableIncomeSource.description}
            required={!incomeSource.reconcilable}
          />
          <Select
            id="income-source-type-dropdown"
            name="income-source-type-dropdown"
            options={incomeSourceTypeOptions}
            onChange={handleChangeIncomeSouceType}
            selectedValue={editableIncomeSource.selectedIncomeSource.id || null}
            label="Income type"
            placeholder={"Select..."}
            required={true}
          />
          {editableIncomeSource.selectedIncomeSource.description && (
            <div className={`hui-banner-content hui-alert ${editableIncomeSource.selectedIncomeSource.warningDescription ? "hui-alert--danger" : "hui-alert--info"} tw-mt-4`} role="alert">
              <div className="hui-alert__content">
                <span dangerouslySetInnerHTML={{ __html: editableIncomeSource.selectedIncomeSource.description }}></span>
              </div>
            </div>
          )}
          {incomeSource.reconcilable ?
            <ReconciledIncomeSourceConfirmation
              editableIncomeSource={editableIncomeSource}
              setEditableIncomeSource={setEditableIncomeSource}
              incomeSource={incomeSource}
              currentFy={currentFy}
              timeZone={timeZone}
            />
            :
            <>
              {shouldAllowIncomeSource() &&
                <AmountsAndDates
                  editableIncomeSource={editableIncomeSource}
                  setEditableIncomeSource={setEditableIncomeSource}
                  incomeSource={incomeSource}
                  currentFy={currentFy}
                  timeZone={timeZone}
                />
              }
            </>
          }
          {editing && (isImpersonating || incomeSource.showDelete) && (
            <div className="tw-text-red-600 tw-my-6 tw-flex tw-justify-end">
              <Icon type="TrashIcon" classes="tw-text-red-600" />
              <Button
                classes="tw-text-red-600 tw-font-bold"
                variant="unstyled"
                onClick={() => setDeleteModalOpen(true)}
              >
                {I18n.t("delete_text", { scope: ctx })}
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <TaxRateConsentModal
        taxRateConsentModalOpen={taxRateConsentModalOpen}
        setTaxRateConsentModalOpen={setTaxRateConsentModalOpen}
        taxRateConsent={taxRateConsent}
        setTaxRateConsent={setTaxRateConsent}
        submitIncomeSource={submitIncomeSource}
      />
    </>
  )
}

export default IncomeSourceModal
