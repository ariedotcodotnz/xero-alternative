import React, { useEffect, useState } from "react";
import Input from "../../_atoms/input/Input";
import { Address, AddressFieldComponent } from "../../_organisms/address_autocomplete/types";

const UkAddressFields = ({
  addressRequired,
  fields,
  formNames,
  onManualInput }: {
    addressRequired: boolean,
    fields: Address,
    formNames: Address,
    onManualInput: (input: string, component: AddressFieldComponent) => void,
  }
) => {
  const [addressLine1Required, setAddressLine1Required] = useState(false)
  const [streetAddressRequired, setStreetAddressRequired] = useState(true)
  useEffect(() => {
    if (fields.streetAddress !== "" && fields.streetNumber !== "") {
      setAddressLine1Required(false);
    } else {
      setAddressLine1Required(true);
    };

    if (fields.addressLine1 !== "" || !fields.addressLine1) {
      setStreetAddressRequired(false);
    } else {
      setStreetAddressRequired(true);
    };
  }, [fields]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-py-8 tw-px-4 tw-bg-gray-50 tw-rounded-b-sm">
      <div className="tw-flex tw-gap-4">
        <div className="tw-w-full">
          <Input
            inputClasses="tw-px-0"
            label="Address Line 1"
            legacyStyles={true}
            name={formNames?.addressLine1}
            required={addressRequired && addressLine1Required}
            setValue={(input) => onManualInput(input, "addressLine1")}
            value={fields?.addressLine1}
          />
        </div>
      </div>
      <div className="tw-flex tw-gap-4">
        <div className="tw-w-1/4">
          <Input
            inputClasses="tw-px-0"
            label="Street number"
            legacyStyles={true}
            name={formNames?.streetNumber}
            required={addressRequired && streetAddressRequired}
            setValue={(input) => onManualInput(input, "streetNumber")}
            value={fields?.streetNumber}
            testId="street-number"
          />
        </div>
        <div className="tw-w-3/4">
          <Input
            inputClasses="tw-px-0"
            label="Street address"
            legacyStyles={true}
            name={formNames?.streetAddress}
            required={addressRequired && streetAddressRequired}
            setValue={(input) => onManualInput(input, "streetAddress")}
            value={fields?.streetAddress}
            testId="street-address"
          />
        </div>
      </div>
      <div className="tw-flex tw-gap-4 tw-flex-wrap sm:tw-flex-nowrap">
        <div className="tw-w-full">
          <Input
            inputClasses="tw-px-0"
            label="Post town"
            legacyStyles={true}
            name={formNames?.postTown}
            required={addressRequired}
            setValue={(input) => onManualInput(input, "postTown")}
            value={fields?.postTown}
            testId="post-town"
          />
        </div>
        <div className="tw-w-full">
          <Input
            inputClasses="tw-px-0"
            label="Postcode"
            legacyStyles={true}
            name={formNames?.postcode}
            required={addressRequired}
            setValue={(input) => onManualInput(input, "postcode")}
            value={fields?.postcode}
            testId="postcode"
          />
        </div>
      </div>
      <div className="tw-flex tw-gap-4">
        <div className="tw-w-full">
          <Input
            inputClasses="tw-px-0"
            label="Country"
            legacyStyles={true}
            name={formNames?.country}
            required={addressRequired}
            setValue={(input) => onManualInput(input, "country")}
            value={fields?.country}
            testId="country"
          />
        </div>
      </div>
    </div>
  )
};

export default UkAddressFields;
