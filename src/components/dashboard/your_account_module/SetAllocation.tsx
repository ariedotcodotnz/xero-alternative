import React, { useEffect, useMemo } from "react";
import I18n from "../../../utilities/translations";

import InputPrice from "../../_atoms/input/InputPrice";
import Select from "../../_atoms/select/Select";
import Accordion from "../../_molecules/accordion/Accordion";
import Switch from "../../_atoms/switch/Switch";
import Badge from "../../_atoms/badge/Badge";
import InputWithTooltip from "../../_molecules/input_group/InputWithTooltip";

export interface iAllocationTemplate {
  name: string;
  allocationType: string;
  title: string;
  payeeAccountNumber: number;
}

export interface iSetupAllocation {
  allocationFrequencyOptions: string[];
  allocationTemplate: iAllocationTemplate;
  isImpersonating: boolean;
  maxAllocationPercentage: number;
}

interface iSetAllocationProps extends iSetupAllocation {
  setShowModal: (value: boolean) => void;
  resetScreen: () => void;
  setAllocationFrequency: (frequency: string) => void;
  setAllocationPercentage: (percentage: string) => void;
  setAllocationCap: (cap: string) => void;
  setAllocationLocked: (locked: boolean) => void;
  setDisabledSubmit: (disabled: boolean) => void;
  allocationFrequency: string;
  allocationPercentage: string;
  allocationCap: string;
  allocationLocked: boolean;
}

const SetAllocation = ({
  allocationFrequencyOptions,
  isImpersonating,
  setAllocationFrequency,
  setAllocationPercentage,
  setAllocationCap,
  setAllocationLocked,
  allocationFrequency,
  allocationPercentage,
  allocationCap,
  allocationLocked,
  maxAllocationPercentage,
  setDisabledSubmit,
}: iSetAllocationProps) => {
  useEffect(() => {
    if (allocationLocked && !isImpersonating) {
      setDisabledSubmit(true);
    } else if (
      (allocationCap && allocationFrequency === "") ||
      (allocationFrequency && allocationCap === "") ||
      allocationPercentage === ""
    ) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [
    allocationFrequency,
    allocationCap,
    allocationPercentage,
    isImpersonating,
    allocationLocked,
    setDisabledSubmit,
  ]);

  const options = useMemo(
    () =>
      allocationFrequencyOptions.map((i) => ({
        name: i,
        value: i,
        id: i,
      })),
    [allocationFrequencyOptions],
  );

  const handleCapChange = (value: string) => {
    setAllocationCap(value);
  };

  const handleFrequencyChange = (value: string) => {
    setAllocationFrequency(value);
  };

  const handlePercentageChange = (value: string) => {
    setAllocationPercentage(value);
  };

  const { currencySymbol } = window.Hnry.User.jurisdiction;

  return (
    <div>
      <p>
        Allocate a percentage of every payment to remain in your Hnry Account
        for business expenses.
      </p>
      <form>
        <div className="tw-flex tw-flex-col">
          <InputWithTooltip
            id="allocation_preference_percentage"
            label="Allocation percentage"
            popoverMessage={I18n.t(
              "allocation_preferences.form.percentage_info",
            )}
            type="number"
            name="allocation_preference[percentage]"
            step="0.01"
            rightIcon="%"
            setValue={handlePercentageChange}
            value={allocationPercentage}
            max={maxAllocationPercentage.toString()}
            required
            disabled={!isImpersonating && allocationLocked ? true : undefined}
          />
        </div>
        <Accordion title="Advanced options" forceMount className="tw-mt-4">
          <div className="tw-flex tw-w-full tw-flex-col tw-justify-between tw-gap-x-3 sm:tw-flex-row">
            <InputPrice
              placeholder="0.00"
              name="allocation_preference[cap]"
              id="allocation_preference_cap"
              label="Maximum"
              onChange={handleCapChange}
              value={allocationCap}
              disabled={allocationLocked && !isImpersonating}
              currencySign={currencySymbol}
            />
            <div className="tw-w-full sm:tw-w-2/3">
              <Select
                options={options}
                onChange={handleFrequencyChange}
                selectedValue={allocationFrequency}
                id="allocation_preference_cap_frequency"
                name="allocation_preference[cap_frequency]"
                disabled={!isImpersonating && allocationLocked}
                label="Frequency"
              />
            </div>
          </div>
          {isImpersonating && (
            <div className="tw-mt-4 tw-flex tw-gap-x-1">
              <Switch
                checked={allocationLocked}
                id="allocation_preference_locked_at"
                label="Locked Allocation"
                onChange={() => {
                  setAllocationLocked(!allocationLocked);
                }}
                isAdmin
              />
              <Badge text="Admin only" variant="admin" />
            </div>
          )}
        </Accordion>
      </form>
    </div>
  );
};

export default SetAllocation;
