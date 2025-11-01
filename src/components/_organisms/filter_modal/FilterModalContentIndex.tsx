import React from "react";
import Icon from "../../_atoms/icons/icon/Icon";
import {
  FilterOption,
  SortOption,
  TableFilterReducerState,
} from "../table_filters/types";
import generateSortLabel from "./FilterModalContentSortLabel";

const listItem = (
  title: string,
  description: string,
  key: string,
  onClick: (arg0: string) => void,
  showIndicator?: boolean,
): React.ReactNode => (
  <li key={title} className="hover:tw-bg-gray-50">
    <button
      onClick={() => onClick(key)}
      className="tw-flex tw-items-center tw-px-2 tw-py-4 tw-text-left tw-w-full hover:tw-bg-gray-100"
    >
      <div className="tw-grow">
        <h3 className="tw-flex-auto tw-truncate tw-text-sm tw-font-semibold tw-leading-6 tw-text-gray-900">
          {title}
          {showIndicator && <span className="tw-text-2xl/6 tw-pl-0.5 tw-text-blue-500 tw-align-bottom">•</span>}
        </h3>
        <p className="tw-mt-2 tw-mb-0 tw-truncate tw-text-sm tw-text-gray-500">
          {description}
        </p>
      </div>
      <Icon type="ChevronRightIcon" />
    </button>
  </li>
);

interface IndexContent {
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
  state: TableFilterReducerState;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}

const IndexContent = ({
  sortOptions,
  filterOptions,
  state,
  setScreen,
}: IndexContent) => {
  const currentlyActiveFilterOption = (filterName) => {
    const key = state.activeFilters.find((f) => f.key === filterName);
    return filterOptions
      .find((f) => f.fieldname === filterName)
      .items.find((i) => i.key === key?.value);
  };

  const currentSortOption = sortOptions.find(
    (option) => option.value === state.activeSort.key,
  );

  const sortLabel = generateSortLabel(
    currentSortOption,
    state.activeSort.direction,
  );

  return (
    <ul className="tw-divide-y tw-divide-gray-200 tw-mb-0 -tw-mt-2">
      {listItem("Sort by", sortLabel, "sort", setScreen)}
      {filterOptions.map((filter) =>
        listItem(
          filter.label,
          currentlyActiveFilterOption(filter.fieldname).value,
          filter.fieldname,
          () => setScreen(filter.fieldname),
          currentlyActiveFilterOption(filter.fieldname).value !== "All",
        ),
      )}
    </ul>
  );
};

export default IndexContent;
