import React from "react";
import { Transition } from "@headlessui/react";
import ComboBox from "../../_molecules/combobox/Combobox";
import Input from "../../_atoms/input/Input";
import Icon from "../../_atoms/icons/icon/Icon";
import AuAddressFields from "../../_molecules/address_forms/AuAddressFields";
import NzAddressFields from "../../_molecules/address_forms/NzAddressFields";
import UkAddressFields from "../../_molecules/address_forms/UkAddressFields";
import { AddressAutocompleteProps } from "./types";
import useAddressAutoCompleteSearch from "./useAddressAutoCompleteSearch";
import { DEFAULT_PRESELECT_ID } from "./addressAutocompleteUtils";






const AddressAutocomplete = ({
  addressRequired,
  formNames,
  formValues,
  jurisdictionCode,
  showMoreDetails,
  displayLabel = "Address (cannot be a PO Box)",
}: AddressAutocompleteProps) => {


  const { state,
    setQuery,
    setMoreDetails,
    setSelectedSuggestion,
    onManualInput } =
    useAddressAutoCompleteSearch(formValues, showMoreDetails);

  const { fields, isLoading, moreDetails, query, stateRequired, suggestions } = state

  return (
    <>
      <div className="tw-flex tw-gap-x-2 tw-items-end">
        <div className="tw-grow">
          <ComboBox
            entries={suggestions}
            fallbackOption={
              query.length > 3 &&
              !isLoading && {
                key: "Other",
                value: "I can't find my address 😥",
              }
            }
            label={displayLabel}
            name="address-autocomplete"
            nullable={true}
            placeholder="Start typing..."
            required={!moreDetails && addressRequired}
            filterFunction={(_, entries) => entries.slice()}
            query={query}
            setQuery={setQuery}
            selectedValue={fields.googlePlaceId}
            setSelectedValue={setSelectedSuggestion}
          />
        </div>
        <button
          type="button"
          className="tw-h-16"
          title="Manually type my address"
          onClick={(e) => {
            e.preventDefault();
            setMoreDetails(!moreDetails);
          }}
        >
          <span className="tw-sr-only">Manually type my address</span>
          <Icon hoverOn={true} classes="tw-mt-5" />
        </button>
      </div>

      <Transition
        show={moreDetails}
        enter="tw-transition-all tw-ease tw-duration-300"
        enterFrom="tw-opacity-0 -tw-translate-y-16 tw-max-h-0"
        enterTo="tw-opacity-100 tw-max-h-96"
        leave="tw-transition-all tw-ease tw-duration-300"
        leaveFrom="tw-opacity-100 tw-max-h-96"
        leaveTo="tw-opacity-0 -tw-translate-y-16 tw-max-h-0"
        unmount={false}
      >
        {() => {
          switch (jurisdictionCode) {
          case "au":
            return (
              <AuAddressFields
                addressRequired={moreDetails && addressRequired}
                fields={fields}
                formNames={formNames}
                onManualInput={onManualInput}
                stateRequired={stateRequired}
              />
            );
          case "nz":
            return (
              <NzAddressFields
                addressRequired={moreDetails && addressRequired}
                fields={fields}
                formNames={formNames}
                onManualInput={onManualInput}
              />
            );
          case "uk":
            return (
              <UkAddressFields
                addressRequired={moreDetails && addressRequired}
                fields={fields}
                formNames={formNames}
                onManualInput={onManualInput}
              />
            );
          default:
            return null;
          }
        }}
      </Transition>
      <Input
        name={formNames?.googlePlaceId}
        value={
          fields.googlePlaceId === DEFAULT_PRESELECT_ID
            ? ""
            : fields?.googlePlaceId
        }
        type="hidden"
      />
    </>
  );
};

export default AddressAutocomplete;
