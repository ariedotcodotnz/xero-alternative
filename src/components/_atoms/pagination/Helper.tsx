import React from "react";
import Icon from "../icons/icon/Icon";

export const pages = (selected = "1", includedGap = false) => {
  let list = ["1", "2", "3", "4", "5"];
  if (includedGap) {
    list = ["1", "2", "3", "...", "10", "11", "12"];
  }

  return list.map((page) => (
    { page, selected: selected === page }
  ));
};

// Can't included in the stories file due to storybook
// try to render any const that included "export const"
export const renderPages = (list) => (
  list.map(({ page, selected }) => (
    <>
      {page === "1" && selected && (
        <span className="hnry-pagination-link disabled">
          <Icon type="ChevronLeftIcon" size="sm" />
          <span className="label prev">Previous</span>
        </span>
      )}
      {page === "1" && !selected && (
        <a data-remote="true" href="" rel="prev">
          <Icon type="ChevronLeftIcon" size="sm" />
          <span className="label prev">Previous</span>
        </a>
      )}
      {selected ? (
        <span className="hnry-pagination-link label current">{page}</span>
      ) : (
        <a data-remote="true" href="#">
          <span className="tw-text-sm tw-font-medium">{page}</span>
        </a>
      )}
      {page === list[list.length - 1].page && selected && (
        <span className="hnry-pagination-link disabled">
          <span className="label next">Next</span>
          <Icon type="ChevronRightIcon" size="sm" />
        </span>
      )}
      {page === list[list.length - 1].page && !selected && (
        <a data-remote="true" href="" rel="next">
          <span className="label next">Next</span>
          <Icon type="ChevronRightIcon" size="sm" />
        </a>
      )}
    </>
  ))
);
