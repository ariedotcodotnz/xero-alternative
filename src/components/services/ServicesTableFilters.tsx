import React from "react";
import TableFilters from "@hui/_organisms/table_filters/TableFilters";
import {
  ModelType,
  SortOption,
  SortSelection,
} from "@hui/_organisms/table_filters/types";

export interface iServicesTableFilters {
  view: {
    search: boolean;
    sort?: {
      columns: SortOption[];
      default: SortSelection;
    };
    queryPath: string;
  };
  model: ModelType;
}

const ServicesTableFilters = ({ view, model }: iServicesTableFilters) => {
  const { columns: sortOptions, default: defaultSort } = view.sort || {};

  return (
    <div className="tw-space-y-4 tw-mb-4">
      {view && (
        <TableFilters
          showSearch={view.search}
          sortOptions={sortOptions}
          defaultSort={defaultSort}
          queryPath={view.queryPath}
          model={model}
        />
      )}
    </div>
  );
}

export default ServicesTableFilters;
