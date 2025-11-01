import React, { useMemo } from "react";
import RadioButtonPopover from "../../_molecules/popover/RadioButtonPopover";
import { KeyValuePair } from "./types";

interface iFilterPopover {
  fieldName: string;
  filterName: string;
  items: KeyValuePair[];
  onChange: (item: KeyValuePair) => void;
  selected: string;
}

const FilterPopover = ({
  fieldName,
  filterName,
  items,
  onChange,
  selected,
}: iFilterPopover) => {
  const filterItems = useMemo(() => (
    items.map(({ value, key }) => ({ value: key, name: value }))
  ), [items]);

  const handleChange = (value) => {
    onChange({ key: fieldName, value });
  };

  const formattedSelected = useMemo(() => {
    const index = filterItems.findIndex(({ value }) => selected === value)

    return filterItems[index];
  }, [filterItems, selected]);

  return (
    <div className="tw-min-w-[6rem] tw-hidden sm:tw-block" id={`${filterName}-popover`}>
      <RadioButtonPopover
        items={filterItems}
        onChange={handleChange}
        selected={formattedSelected}
        fieldName={fieldName}
        ariaLabel={`Filter by ${filterName}`}
        id={`${filterName}-popover`}
      />
    </div>
  );
};

export default FilterPopover;
