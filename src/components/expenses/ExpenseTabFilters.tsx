import React, { useState } from "react";
import TableFilters from "@hui/_organisms/table_filters/TableFilters";
import { iTabFilters } from "@hui/_organisms/table_filters/types";
import Tabs from "../_molecules/tabs/Tabs";

const ExpenseTabFilters = ({ views = [], model }: iTabFilters) => {
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

export default ExpenseTabFilters;
