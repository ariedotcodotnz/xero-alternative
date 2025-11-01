import React, { useState, useRef } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import Alert from "@hui/_molecules/alert/Alert";
import I18n from "../../utilities/translations";
import { iMidYearTransition } from "../../types/financialIncomeSource.type";

interface iEditPreHnryIncome {
  editPreHnryModalOpen: boolean;
  setEditPreHnryModalOpen: (booleaen) => void;
  isImpersonating: boolean;
  midYearTransition: iMidYearTransition;
}

const parseCurrencyAmount = (currencyString: string) => Number(currencyString.replace(/[^0-9.-]+/g, '')).toFixed(2)

const ctx = { scope: "pre_hnry_income.edit" };
const EditPreHnryIncome = ({ 
  editPreHnryModalOpen, 
  setEditPreHnryModalOpen,
  isImpersonating,
  midYearTransition,
}: iEditPreHnryIncome) => {
  const form = useRef<HTMLFormElement>();
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");
  const { currencySymbol } = window.Hnry.User.jurisdiction;
  const [income, setPreHnryIncome] = useState(parseCurrencyAmount(midYearTransition.selfEmployedIncome));
  const [tax, setPreHnryTax] = useState(parseCurrencyAmount(midYearTransition.selfEmployedTaxPaid));
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(midYearTransition.locked);
  
  const inputsDisabled = isImpersonating ? false : midYearTransition.locked;

  const handleIncomeChange = (value) => {
    setSaveButtonDisabled(value.length < 1);
    setPreHnryIncome(value);
  }
  const handleTaxChange = (value) => {
    setSaveButtonDisabled(value.length < 1);
    setPreHnryTax(value);
  }

  const handleSubmit = () => {
    form.current.requestSubmit();
  }

  return (
    <Modal
      open={editPreHnryModalOpen}
      setOpen={setEditPreHnryModalOpen}
      title={I18n.t("self_employed", ctx)}
      confirmCTA="Save"
      onConfirm={handleSubmit}
      disabled={saveButtonDisabled}
    >
      <form
        data-remote="true"
        ref={form}
        method="PATCH"
        action={Routes.pre_hnry_income_path(midYearTransition.id)}
      >
        <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
        <div className="sm:tw-flex tw-grid sm:tw-justify-between tw-mt-4 tw-mb-6">
          <div className="tw-min-w-14 sm:tw-min-w-52">
            <label
              className="hnry-label"
              htmlFor="mid_year_transition_self_employed_self_employed_income"
            >
              <span className="tw-flex tw-items-center tw-gap-x-1 tw-pt-2">
                {I18n.t("income_label", ctx)}
              </span>
            </label>
            <InputPrice
              value={income}
              onChange={handleIncomeChange}
              name="mid_year_transition[self_employed_income]"
              id="mid_year_transition_self_employed_self_employed_income"
              label="mid_year_transition_self_employed_self_employed_income"
              hideLabel={true}
              currencySign={currencySymbol}
              disabled={inputsDisabled}
            />
          </div>
          <div className="tw-min-w-14 sm:tw-min-w-52">
            <label
              className="hnry-label"
              htmlFor="mid_year_transition_self_employed_tax_paid"
            >
              <span className="tw-flex tw-items-center tw-gap-x-1 tw-pt-2">
                {I18n.t("tax_paid_label", ctx)}
                <Tooltip popoverMessage={I18n.t("tax_paid_tooltip", ctx)} size="sm" />
              </span>
            </label>
            <InputPrice
              value={tax}
              onChange={handleTaxChange}
              hideLabel={true}
              name="mid_year_transition[self_employed_tax_paid]"
              id="mid_year_transition_self_employed_tax_paid"
              label="mid_year_transition_self_employed_tax_paid"
              currencySign={currencySymbol}
              disabled={inputsDisabled}
            />
          </div>
        </div>
        {midYearTransition.warning && (
          <Alert>
            {midYearTransition.warning}
          </Alert>
        )}
      </form>
    </Modal>
  );
}

export default EditPreHnryIncome;
