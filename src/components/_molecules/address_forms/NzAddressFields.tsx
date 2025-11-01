import React from "react";
import Input from "../../_atoms/input/Input";
import {
  Address,
  AddressFieldComponent,
} from "../../_organisms/address_autocomplete/types";

const NzAddressFields = ({
  addressRequired,
  fields,
  formNames,
  onManualInput,
}: {
  addressRequired: boolean;
  fields: Address;
  formNames: Address;
  onManualInput: (input: string, component: AddressFieldComponent) => void;
}) => (
  <div className="tw-flex tw-flex-col tw-gap-4 tw-py-8 tw-px-4 tw-bg-gray-50 tw-rounded-b-sm">
    <div className="tw-flex tw-gap-4">
      <div className="tw-w-1/4">
        <Input
          inputClasses="tw-px-0"
          label="Street number"
          legacyStyles={true}
          name={formNames.streetNumber}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "streetNumber")}
          value={fields.streetNumber}
        />
      </div>
      <div className="tw-w-3/4">
        <Input
          inputClasses="tw-px-0"
          label="Street address"
          legacyStyles={true}
          name={formNames.streetAddress}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "streetAddress")}
          value={fields.streetAddress}
        />
      </div>
    </div>
    <div className="tw-flex tw-gap-4 tw-flex-wrap sm:tw-flex-nowrap">
      <div className="tw-w-full">
        <Input
          inputClasses="tw-px-0"
          label="Suburb"
          legacyStyles={true}
          name={formNames.suburb}
          setValue={(input) => onManualInput(input, "suburb")}
          value={fields.suburb}
        />
      </div>
      <div className="tw-w-full">
        <Input
          inputClasses="tw-px-0"
          label="City"
          legacyStyles={true}
          name={formNames.city}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "city")}
          value={fields.city}
        />
      </div>
      <div className="tw-w-full">
        <Input
          inputClasses="tw-px-0"
          label="Postcode"
          legacyStyles={true}
          name={formNames.postcode}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "postcode")}
          value={fields.postcode}
        />
      </div>
    </div>
    <div className="tw-flex tw-gap-4">
      <div className="tw-w-1/2">
        <Input
          inputClasses="tw-px-0"
          label="Country"
          legacyStyles={true}
          name={formNames.country}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "country")}
          value={fields.country}
        />
      </div>
      <div className="tw-w-1/2">
        <Input
          inputClasses="tw-px-0"
          label="Province"
          legacyStyles={true}
          name={formNames.state}
          required={addressRequired}
          setValue={(input) => onManualInput(input, "state")}
          value={fields.state}
        />
      </div>
    </div>
  </div>
);

export default NzAddressFields;
