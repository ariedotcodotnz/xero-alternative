import React, { useState } from "react";
import Tabs, { TabsLinkType } from "../../_molecules/tabs/Tabs";
import TableFilters from "../table_filters/TableFilters";
import {
  FilterOption,
  SortOption,
  SortSelection,
  ModelType,
} from "../table_filters/types";

type FilterOptionWithDefault = FilterOption & { default?: string };
export interface iInvoiceTabFilters {
  views: {
    tab: TabsLinkType;
    search: boolean;
    sort?: {
      columns: SortOption[];
      default: SortSelection;
    };
    filter?: FilterOptionWithDefault[];
    queryPath: string;
  }[];
  model: ModelType;
  activeTab?: string;
}

const InvoiceTabFilters = ({
  views = [],
  model,
}: iInvoiceTabFilters) => {
  const [viewItems, setViewItems] = useState(views);

  const handleTabChange = (viewName: string) => {
    const newViews = viewItems.map((view) => ({
      ...view,
      tab: { ...view.tab, active: view.tab.name === viewName },
    }));
    setViewItems(newViews);
  };

  const currentView = viewItems.find((view) => view.tab.active);

  const { columns: sortOptions, default: defaultSort } = currentView.sort || {};

  const defaultFilters = currentView.filter?.map((filter) => ({
    key: filter.fieldname,
    value: filter.default || filter.items[0].key,
  }));

  return (
    <div className="tw-space-y-4 tw-mb-4">
      <Tabs
        tabs={viewItems.map((view) => view.tab)}
        onChange={handleTabChange}
      />
      {currentView && (
        <TableFilters
          showSearch={currentView.search}
          sortOptions={sortOptions}
          defaultFilters={defaultFilters}
          filterOptions={currentView.filter}
          defaultSort={defaultSort}
          panelId={currentView.tab.name}
          queryPath={currentView.queryPath}
          key={currentView.tab.name}
          model={model}
        />
      )}
    </div>
  );
};

export default InvoiceTabFilters;
