import React, { useEffect, useMemo, useState } from "react";
import I18n from "../../../utilities/translations";

import InputPrice from "../../_atoms/input/InputPrice";
import Select from "../../_atoms/select/Select";
import Accordion from "../../_molecules/accordion/Accordion";
import Button from "../../_atoms/button/Button";
import Switch from "../../_atoms/switch/Switch";
import Badge from "../../_atoms/badge/Badge";
import InputWithTooltip from "../../_molecules/input_group/InputWithTooltip";
import {
  setupCardAllocation,
  updateCardAllocation,
} from "../../../API/cards.api";

export interface iAllocationTemplate {
  name: string;
  allocationType: string;
  title: string;
  payeeAccountNumber: number;
}

interface iAllocation {
  id: number;
  percentage: string;
  capFrequency: string;
  cap: string;
  lockedAt?: string;
}

export interface iSetupAllocation {
  allocationFrequencyOptions: string[];
  allocationTemplate: iAllocationTemplate;
  allocation: iAllocation;
  isImpersonating: boolean;
  maxAllocationPercentage: number;
}

interface iSetupAllocationProps extends iSetupAllocation {
  setAllocation: (allocation: iAllocation) => void;
  setShowModal: (value: boolean) => void;
  resetScreen: () => void;
}

const SetupAllocation = ({
  allocationFrequencyOptions,
  allocationTemplate,
  allocation,
  isImpersonating,
  setAllocation,
  setShowModal,
  maxAllocationPercentage,
  resetScreen,
}: iSetupAllocationProps) => {
  const [cap, setCap] = useState(
    allocation && allocation.cap ? allocation.cap : "",
  );
  const [frequency, setFrequency] = useState(
    allocation ? allocation.capFrequency : "",
  );
  const [percentage, setPercentage] = useState(
    allocation ? allocation.percentage : "",
  );
  const [locked, setLocked] = useState(
    Boolean(allocation && allocation.lockedAt),
  );
  const [submitDisabled, setDisabledSubmit] = useState(true);

  useEffect(() => {
    if (allocation) {
      setFrequency(allocation.capFrequency);
      setPercentage(allocation.percentage);
      setFrequency(allocation.capFrequency);
      setCap(allocation.cap || "");

      if (!isImpersonating) {
        setLocked(Boolean(allocation.lockedAt));
      }
    }
  }, [allocation, isImpersonating, locked]);

  useEffect(() => {
    if (locked && !isImpersonating) {
      setDisabledSubmit(true);
    } else if (
      (cap && frequency === "") ||
      (frequency && cap === "") ||
      percentage === ""
    ) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [frequency, cap, percentage, isImpersonating, locked]);

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
    setCap(value);
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };

  const handlePercentageChange = (value: string) => {
    setPercentage(value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowModal(false);

    try {
      let response;
      const payload = {
        frequency,
        percentage,
        cap,
        allocationTemplate,
        locked: isImpersonating ? locked : undefined,
      };

      if (allocation) {
        response = await updateCardAllocation({
          ...payload,
          id: allocation.id,
        });
      } else {
        response = await setupCardAllocation(payload);
      }

      const { message, status, allocation: updatedAllocation } = response;

      if (status === "ok") {
        const {
          cap_frequency: capFrequency,
          cap: newCap,
          id,
          percentage: newPercentage,
          locked_at: lockedAt,
        } = updatedAllocation;

        toastr.success(message);
        setAllocation({
          id,
          cap: newCap,
          lockedAt,
          capFrequency,
          percentage: newPercentage,
        });
      } else {
        const text = message || I18n.t("allocation_preferences.form.error");
        toastr.error(text);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to create or edit Hnry Card allocation", {
          error,
        });
      }
    } finally {
      resetScreen();
    }
  };

  const { currencySymbol } = window.Hnry.User.jurisdiction;

  return (
    <div>
      <p>
        Allocate a percentage of every payment into your account, to top up your
        Hnry Visa Debit Card.
      </p>
      <form onSubmit={handleSubmit}>
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
            value={percentage}
            max={maxAllocationPercentage.toString()}
            required
            disabled={!isImpersonating && locked ? true : undefined}
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
              value={cap}
              disabled={locked && !isImpersonating}
              currencySign={currencySymbol}
            />
            <div className="tw-w-full sm:tw-w-2/3">
              <Select
                options={options}
                onChange={handleFrequencyChange}
                selectedValue={frequency}
                id="allocation_preference_cap_frequency"
                name="allocation_preference[cap_frequency]"
                disabled={!isImpersonating && locked}
                label="Frequency"
              />
            </div>
          </div>
          {isImpersonating && (
            <div className="tw-mt-4 tw-flex tw-gap-x-1">
              <Switch
                checked={locked}
                id="allocation_preference_locked_at"
                label="Locked Allocation"
                onChange={() => {
                  setLocked(!locked);
                }}
                isAdmin
              />
              <Badge text="Admin only" variant="admin" />
            </div>
          )}
        </Accordion>
        <Button type="submit" classes="tw-w-full" disabled={submitDisabled}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SetupAllocation;
