import React, { useMemo, useState } from "react";
import classNames from "classnames";
import Select, { SelectOptionType } from "../../_atoms/select/Select";
import Icon from "../../_atoms/icons/icon/Icon";
import InputPrice from "../../_atoms/input/InputPrice";
import Button from "../../_atoms/button/Button";
import formatToLocalCurrency from "../../../utilities/currency/currency_format";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";

type arrearsPaymentType = {
  financialYear: string;
  amount: string;
}

interface iSalaryArrearsPayments {
  financialYearOptions: SelectOptionType[];
  arrearsPayments: arrearsPaymentType[];
  lumpSumEAmount: number;
}

const SalaryArrearsPayments = ({
  financialYearOptions,
  arrearsPayments,
  lumpSumEAmount,
}: iSalaryArrearsPayments) => {
  const [list, setList] = useState(arrearsPayments);
  const [loading, setLoading] = useState(false);
  const { jurisdiction } = window.Hnry.User;
  const { currencySymbol } = jurisdiction;

  const fyOptions = useMemo(() => {
    const disabledYears = list.map(({ financialYear }) => (financialYear));

    const options = financialYearOptions.map(((option) => {
      if (disabledYears.includes(option.value)) {
        return { ...option, disabled: true };
      }

      return { ...option, disabled: false };
    })) as SelectOptionType[];

    return options;
  }, [financialYearOptions, list]);

  const handleAddLine = () => {
    setList([...list, { financialYear: "", amount: "" }]);
  }

  const handleDelete = (index) => {
    setList(list.slice(0, index).concat(list.slice(index + 1)));
  }

  const handleSelectChange = (value, index) => {
    const updated = list.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          financialYear: value,
        }
      }

      return item;
    });

    setList(updated);
  }

  const handleSubmitClick = () => {
    setLoading(!loading);
  }

  const handlePriceChange = (value, index) => {
    const updated = list.map((item, i) => {
      if (value < 0) {
        value = -value;
      }
      if (index === i) {
        return { ...item, amount: value }
      }

      return item;
    });

    setList(updated);
  }

  const anyEmptyRequired = useMemo(() => (
    list.filter(({ financialYear, amount }) => financialYear === "" || amount === "")
  ), [list]);

  const total = useMemo(() => {
    let totalAmount = 0;

    list.forEach(({ amount }) => { totalAmount += Number(amount); });

    return totalAmount;
  }, [list]);

  const totalDifference = useMemo(() => (
    lumpSumEAmount - total
  ), [total, lumpSumEAmount]);

  const disabledSubmit = useMemo(() => {
    if (totalDifference !== 0) { return true; }

    return anyEmptyRequired.length > 0;
  }, [anyEmptyRequired, totalDifference]);

  const disabledAdd = useMemo(() => {
    if (list.length === 0 && arrearsPayments.length === 0) { return false; }
    if (anyEmptyRequired.length > 0 || totalDifference < 0) { return true; }
    if (totalDifference > 0) { return false; }

    return arrearsPayments && disabledSubmit;
  }, [list, arrearsPayments, disabledSubmit, anyEmptyRequired, totalDifference]);

  return (
    <div>
      <div className="tw-flex tw-flex-col tw-w-full">
        {list.map((item, index) => {
          const { financialYear, amount } = item;

          return (
            <div key={`${financialYear}-row`} className="tw-flex tw-w-full tw-gap-x-3">
              <div className="tw-min-w-32 sm:tw-min-w-56">
                <Select
                  name={`arrears_payments_attributes[financial_year][${index}]`}
                  options={fyOptions}
                  label="Financial year"
                  selectedValue={financialYear}
                  id={`arrears_payments_attributes_financial_year_${index}`}
                  onChange={(value) => handleSelectChange(value, index)}
                  hideLabel={index !== 0}
                />
              </div>
              <div className="tw-flex tw-w-full tw-gap-x-3">
                <InputPrice
                  currencySign={currencySymbol}
                  hideLabel={index !== 0}
                  id={`arrears_payments_attributes_amount_${index}`}
                  label="Income earned"
                  name={`arrears_payments_attributes[amount][${index}]`}
                  onChange={(value) => handlePriceChange(value, index)}
                  placeholder="0.00"
                  value={amount || ""}
                />
                {index === list.length - 1 && (
                  <Button
                    type="button"
                    onClick={() => handleDelete(index)}
                    variant="unstyled"
                    classes={classNames("tw-mt-2", {"tw-mb-auto": index !== 0 })}
                  >
                    <Icon type="TrashIcon" classes="tw-text-red tw-w-6 tw-h-6" />
                    <span className="tw-sr-only">Delete this item</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="tw-flex tw-mb-4">
        <Button
          iconType="PlusIcon"
          variant="link"
          onClick={handleAddLine}
          disabled={disabledAdd}
          classes="tw-max-w-fit"
        >
          Add line
        </Button>
      </div>

      <div className="tw-w-full tw-text-right tw-mb-2 tw-font-semibold">
        <span className="tw-text-left">Total income earned: </span>
        <span>{`${formatToLocalCurrency(total, getUserJurisdictionCode(), { decimals: true })}`}</span>
      </div>
      <div className="tw-w-full tw-text-right tw-mb-4">
        <span className="tw-text-left">Total Lump Sum E: </span>
        <span>{`${formatToLocalCurrency(Number(lumpSumEAmount), getUserJurisdictionCode(), { decimals: true })}`}</span>
      </div>
      {totalDifference < 0 && (
        <p className="tw-pl-0 sm:tw-pl-6 tw-text-xs tw-mb-4 tw-text-right tw-text-red-500">
          Please update your portions to ensure they equal your total Lump Sum E, adjust by ${totalDifference.toFixed(2)}
        </p>
      )}
      <Button
        type="submit"
        onClick={handleSubmitClick}
        loading={loading}
        classes="tw-w-full"
        disabled={disabledSubmit}
      >
        Save and continue
      </Button>
    </div>
  );
};

export default SalaryArrearsPayments;
