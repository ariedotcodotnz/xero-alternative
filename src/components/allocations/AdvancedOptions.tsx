import React, { useMemo, useState, useEffect } from "react";
import MultiSelectFromInput from "@hui/_molecules/multi_select_from_input/MultiSelectFromInput";
import { getUserJurisdictionCurrencySymbol } from "../../utilities/user_attributes";
import Accordion from "../_molecules/accordion/Accordion";
import InputPrice from "../_atoms/input/InputPrice";
import Select from "../_atoms/select/Select";
import Switch from "../_atoms/switch/Switch";
import Badge from "../_atoms/badge/Badge";
import Alert from "../_molecules/alert/Alert";
import I18n from "../../utilities/translations";
import { CheckboxGroupItem } from "../_molecules/checkbox_group/CheckboxGroup";
import { getAllActiveClients } from "../../API/allocation_preferences_clients_api";

interface iPrefence {
  id: number;
  name: string;
  cap_frequency: string;
  cap: string;
  percentage: string;
  locked_at: string;
}
interface iAdvancedOptionsProps {
  frequencyOptions: string[];
  preference: iPrefence;
  isImpersonating: boolean;
}

const AdvancedOptions = ({
  preference,
  isImpersonating,
  frequencyOptions,
}: iAdvancedOptionsProps) => {
  const [cap, setCap] = useState(
    preference && preference.cap ? preference.cap : "",
  );
  const [frequency, setFrequency] = useState(
    preference && preference.cap_frequency ? preference.cap_frequency : "",
  );
  const [locked, setLocked] = useState(
    Boolean(preference && preference.locked_at),
  );
  const [percentage, setPercentage] = useState(
    preference && preference.percentage ? preference.percentage : "",
  );
  const [open, setOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<CheckboxGroupItem[]>([]);
  const allocationId: number | null =
    preference && preference.id ? preference.id : null;

  const updatePercentage = (e) => {
    setPercentage(e.target.value);
  };

  const numberOfAssignedClients = useMemo(
    () => clients.filter((client) => client.checked).length,
    [clients],
  );

  const isAllClients = useMemo(
    () => clients.every((client) => client.checked),
    [clients],
  );

  useEffect(() => {
    const percentageInput = document.getElementById(
      "allocation_preference_percentage",
    );
    if (percentageInput) {
      percentageInput.addEventListener("input", updatePercentage);
    }

    return () => {
      if (percentageInput) {
        percentageInput.removeEventListener("input", updatePercentage);
      }
    };
  });

  const handleClientOutput = (value?: CheckboxGroupItem[]) => {
    if (value !== undefined) {
      setClients(value);
    } else {
      try {
        const fetchAllocationClients = async () => {
          const response = await getAllActiveClients(allocationId);
          if (response !== undefined && response !== null) {
            if (response.length) {
              const formattedClientData: CheckboxGroupItem[] = response.map(
                (client) => ({
                  value: String(client.id),
                  name: client.organisationName,
                  checked: client.isAssignedToAllocation,
                  required: false,
                }),
              );
              setClients(formattedClientData);
            }
          }
        };
        fetchAllocationClients();
      } catch (error) {
        toastr.error(
          I18n.t("allocation_preferences.form.client_api_request_failed"),
        );
      }
    }
  };

  useEffect(() => {
    handleClientOutput();
  }, []);

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };
  const handleCapChange = (value: string) => {
    setCap(value);
  };

  const handleAccordionChanging = () => {
    setOpen(!open);
    if (!open) {
      window.analytics?.track("allocations_advanced_options_opened");
    }
  };

  const options = useMemo(
    () =>
      frequencyOptions.map((i) => ({
        name: i,
        value: i,
        id: i,
      })),
    [frequencyOptions],
  );

  const currencySymbol = getUserJurisdictionCurrencySymbol();

  const clientsText = useMemo(() => {
    if (isAllClients) {
      return `from ${I18n.t(
        "allocation_preferences.form.select_client_all_selected",
      ).toLowerCase()}`;
    }
    if (clients.every((item) => !item.checked)) {
      return "";
    }
    return `from ${numberOfAssignedClients} client${
      numberOfAssignedClients > 1 ? "s" : ""
    }`;
  }, [isAllClients, clients, numberOfAssignedClients]);

  return (
    <Accordion
      open={open}
      title="Advanced Options"
      forceMount
      className="tw-mt-4"
      onOpenChange={handleAccordionChanging}
    >
      <fieldset>
        <div className="tw-mx-[-15px] tw-flex tw-flex-wrap tw-gap-y-4">
          <MultiSelectFromInput
            addOptionText={I18n.t("allocation_preferences.form.add_client")}
            allSelectedText={I18n.t(
              "allocation_preferences.form.select_client_all_selected",
            )}
            clientIdsName="allocation_preference[client_ids][]"
            id="allocation_preference_all_clients"
            labelText={I18n.t(
              "allocation_preferences.form.select_client_label",
            )}
            name="allocation_preference[all_clients]"
            modalButtonText={I18n.t(
              "allocation_preferences.form.select_client_modal_confirm",
            )}
            modalTitle={I18n.t(
              "allocation_preferences.form.select_client_modal_title",
            )}
            noSearchResultsText={I18n.t(
              "allocation_preferences.form.no_clients",
            )}
            onChange={handleClientOutput}
            options={clients}
            placeholder="Select clients"
            trackingEventPrefix="allocation_per_client"
          />
          <div className="sm:w-1/2 sm:shrink-0 tw-relative tw-min-h-px tw-w-full tw-max-w-full tw-px-3.5 sm:tw-max-w-[50%]">
            <InputPrice
              placeholder="0.00"
              name="allocation_preference[cap]"
              id="allocation_preference_cap"
              label="Maximum"
              currencySign={currencySymbol}
              onChange={handleCapChange}
              value={cap}
              disabled={locked && !isImpersonating}
            />
          </div>
          <div className="sm:w-1/2 sm:shrink-0 tw-relative tw-min-h-px tw-w-full tw-max-w-full tw-px-3.5 sm:tw-mt-0 sm:tw-max-w-[50%] md:tw-mt-0">
            <Select
              id="frequency-dropdown"
              name="allocation_preference[cap_frequency]"
              options={options}
              onChange={handleFrequencyChange}
              selectedValue={frequency}
              disabled={locked && !isImpersonating}
              label="Frequency"
              onClear={() => setFrequency("")}
            />
          </div>
        </div>
      </fieldset>

      {percentage && (!isAllClients || (cap && frequency)) && (
        <div className="tw-pt-4 sm:tw-mt-0">
          <Alert
            variant={
              !isAllClients && numberOfAssignedClients === 0
                ? "warning"
                : "info"
            }
          >
            <p className="tw-mb-0 tw-text-sm">
              {!isAllClients && numberOfAssignedClients === 0 ? (
                <>Select at least one client to set up your allocation.</>
              ) : (
                <>
                  Your allocation is set up to deduct{" "}
                  <strong>{percentage}%</strong> of each payslip
                  <strong> {clientsText}</strong>
                  {cap && frequency && (
                    <>
                      {" "}
                      up to a maximum of{" "}
                      <strong>
                        {currencySymbol}
                        {cap} {frequency.toLowerCase()}
                      </strong>
                    </>
                  )}
                  .
                </>
              )}
            </p>
          </Alert>
        </div>
      )}
      {isImpersonating && (
        <div className="tw-mt-4 tw-flex tw-gap-x-1">
          <Switch
            checked={locked}
            id="allocation_preference_locked_at"
            label="Lock Allocation"
            onChange={() => {
              setLocked(!locked);
            }}
            isAdmin
          />
          <input
            type="hidden"
            id="allocation_preference_locked_at"
            name="allocation_preference[locked_at]"
            value={locked ? "1" : "0"}
          />
          <Badge text="Admin only" variant="admin" />
        </div>
      )}
    </Accordion>
  );
};

export default AdvancedOptions;
