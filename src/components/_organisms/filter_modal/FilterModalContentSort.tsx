import React from "react";
import {
  SortDirection,
  SortOption,
  SortSelection,
  TableFilterReducerState,
} from "../table_filters/types";
import RadioButtonList from "../../_molecules/radio_button_list/RadioButtonList";
import generateSortLabel from "./FilterModalContentSortLabel";

const DIVIDER = "::";

interface SortTemplate {
  sortOptions: SortOption[];
  state: TableFilterReducerState;
  onChange: ({ key, direction }: SortSelection) => void;
}

const SortTemplate = ({
  sortOptions,
  state,
  onChange,
}: SortTemplate) => {
  const directions: SortDirection[] = ["asc", "desc"];

  const radioOptions = sortOptions
    .map((sortOption) =>
      directions.map((direction) => ({
        name: generateSortLabel(sortOption, direction),
        value: [sortOption.value, direction].join(DIVIDER),
      })),
    )
    .flat();

  return (
    <div className="tw-mt-2 tw-max-h-[15.5rem] tw-overflow-y-scroll">
      <RadioButtonList
        items={radioOptions}
        onChange={(optionId) => {
          onChange({
            key: optionId.split(DIVIDER)[0],
            direction: optionId.split(DIVIDER)[1] as SortDirection,
          });
        }}
        value={[state.activeSort.key, state.activeSort.direction].join(DIVIDER)}
      />
    </div>
  );
};

export default SortTemplate;
