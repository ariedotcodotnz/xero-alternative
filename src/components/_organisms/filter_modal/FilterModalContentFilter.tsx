import React from "react";
import {
  FilterOption,
  KeyValuePair,
  TableFilterReducerState,
} from "../table_filters/types";
import RadioList from "../../_molecules/radio_button_list/RadioButtonList";

interface FilterTemplate {
  filterName: string;
  filterOptions: FilterOption[];
  state: TableFilterReducerState;
  onChange: (item: KeyValuePair) => void;
}

const FilterTemplate = ({
  filterName,
  filterOptions,
  state,
  onChange,
}: FilterTemplate) => {
  const filterOption = filterOptions.find((f) => f.fieldname === filterName);
  const radioItems = filterOption.items.map((filterItem) => ({
    name: filterItem.value,
    value: filterItem.key,
  }));

  return (
    <div className="tw-mt-2 tw-max-h-[15.5rem] tw-overflow-y-scroll">
      <RadioList
        items={radioItems}
        onChange={(optionId) => { onChange({ key: filterOption.fieldname, value: optionId }); }}
        value={
          state.activeFilters.find((f) => f.key === filterOption.fieldname)
            ?.value || filterOption.items[0].key
        }
      />
    </div>
  );
};

export default FilterTemplate;
