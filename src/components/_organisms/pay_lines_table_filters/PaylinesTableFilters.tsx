import React from "react";
import TableFilters from "../table_filters/TableFilters";
import {
  FilterOption,
  ModelType,
  SortOption,
  SortSelection,
} from "../table_filters/types";

type FilterOptionWithDefault = FilterOption & { default?: string };
export interface iPaylinesTableFilters {
  view: {
    search: boolean;
    sort?: {
      columns: SortOption[];
      default: SortSelection;
    };
    filter?: FilterOptionWithDefault[];
    queryPath: string;
  };
  model: ModelType;
}

const PaylinesTableFilters = ({
  view,
  model,
}: iPaylinesTableFilters) => {
  const defaultFilters = view.filter?.map((currentFilter) => ({
    key: currentFilter.fieldname,
    value: currentFilter.default || currentFilter.items[0].key,
  }));

  const { columns: sortOptions, default: defaultSort } = view.sort || {};

  return (
    <div className="tw-space-y-4 tw-mb-4">
      {view && (
        <TableFilters
          showSearch={view.search}
          sortOptions={sortOptions}
          defaultFilters={defaultFilters}
          filterOptions={view.filter}
          defaultSort={defaultSort}
          queryPath={view.queryPath}
          model={model}
        />
      )}
    </div>
  );
};

export default PaylinesTableFilters;
