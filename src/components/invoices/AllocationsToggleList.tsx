import React, { useEffect, useState } from "react";
import Input from "@hui/_atoms/input/Input";
import { InvoiceAllocationPreferenceData } from "../../API/allocation_preferences_invoices_api";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import Switch from "../_atoms/switch/Switch";

const AllocationsToggleList = ({
  allocationData,
  setAllocations,
}: {
  allocationData: InvoiceAllocationPreferenceData[];
  setAllocations: (value: InvoiceAllocationPreferenceData[]) => void;
}) => {
  const { formNameFor } = useInvoiceQuoteContext();
  const [allAllocationsEnabled, setAllAllocationsEnabled] = useState<
    boolean | undefined
  >();

  const handleToggleChange = (id: number) => {
    const updatedState = allocationData.map(
      (allocation: InvoiceAllocationPreferenceData) =>
        allocation.id === id
          ? { ...allocation, enabled: !allocation.enabled }
          : allocation
    );
    setAllocations(updatedState);

    const changed = updatedState.find((allocation) => allocation.id === id);

    window.analytics.track("invoice_allocations_toggled", {
      payee_name: changed.payeeName,
      allocation_id: changed.id,
      toggle_state: changed.enabled ? "enabled" : "disabled",
    });
  };

  useEffect(() => {
    const checkedAllocations = allocationData.filter(
      (a) => a.locked || (a.enabled && !a.paused)
    );
    setAllAllocationsEnabled(
      allocationData.length === checkedAllocations.length
    );
  }, [allocationData]);

  if (allAllocationsEnabled === undefined) return null;

  return (
    <div className="tw-grid tw-gap-8 sm:tw-grid-cols-2 tw-mb-2">
      {allocationData.map(
        ({ id, payeeName, percentage, paused, locked, enabled }) => {
          const isDisabled = paused || locked;
          const isChecked = locked || (enabled && !paused);

          return (
            <div className="tw-grid tw-grid-cols-[max-content_1fr] tw-gap-x-4 tw-gap-y-1 hnry-switch-hide-label tw-items-center" key={id}>
              <div className="tw-col-start-2">
                <label htmlFor={`${id}-percentage`} className="hnry-label">{payeeName}</label>
              </div>
              <div className="tw-row-start-2">
                <Switch
                  id={id.toString()}
                  name={payeeName}
                  label={payeeName}
                  checked={isChecked}
                  onChange={() => handleToggleChange(id)}
                  disabled={isDisabled}
                />
              </div>
              <div className="tw-w-full">
                <Input id={`${id}-percentage`} labelRendered={false} disabled value={`${percentage}%`}/>
              </div>
              {allAllocationsEnabled === false && isChecked && (
                <input
                  type="hidden"
                  name={formNameFor("allocation_preference_ids[]")}
                  value={id}
                />
              )}
            </div>
          );
        }
      )}
      <input
        type="hidden"
        name={formNameFor("all_client_allocation_preferences")}
        value={allAllocationsEnabled.toString()}
      />
      {allAllocationsEnabled === true && (
        <input
          type="hidden"
          name={formNameFor("allocation_preference_ids[]")}
          value=""
        />
      )}
    </div>
  );
};

export default AllocationsToggleList;
