import React, { useState } from "react";
import Combobox, {
  iHnryComboboxEntry,
} from "../../_molecules/combobox/Combobox";

export interface iPhoneNumberPrefix {
  entries: iHnryComboboxEntry[];
  name: string;
  selected?: string | number;
  required?: boolean;
}

const PhoneNumberPrefix = ({
  entries,
  name,
  selected,
  required,
}: iPhoneNumberPrefix) => {
  const selectedKey =
    entries.find((entry) => entry.value === selected)?.key || entries[0].key;
  const [selectedValue, setSelectedValue] = useState(selectedKey);
  return (
    <Combobox
      entries={entries}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
      label="Phone number prefix"
      placeholder=""
      id={name}
      name={name}
      required={required}
      nullable
    />
  );
};

export default PhoneNumberPrefix;
