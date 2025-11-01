
import React from "react";
import "./lists.scss";

export function StackedList<T extends {[identifier: string]: string | number | Date }>({items, containerClasses, itemPadding}: {items: T[], containerClasses?: string, itemPadding?: string }) {

  return(
    <div className={`${containerClasses}`} >
      <ol className="hui-stacked-list tw-max-h-72 md:tw-max-h-96 xl:tw-max-h-80">
      {items.map((hash) => {
        const [key, value] = Object.entries(hash)[0];
        return value ? <li key={`${key.toString()}-key`} className={`hui-stacked-list__item ${itemPadding}`}>
                  <div className="hui-stacked-list__item-left">
                    <p className="tw-text-base tw-leading-6 tw-text-gray-900 tw-mb-0 tw-font-light">
                      <span className="tw-text-ellipsis tw-overflow-hidden">{key}</span>
                    </p>
                  </div>
                  <div className="hui-stacked-list__item-right tw-flex-col">
                    <p className="tw-text-base xl:tw-text-sm 2xl:tw-text-base tw-font-light tw-leading-6 tw-text-gray-900 tw-mb-0 tw-mr-2">{value.toString()}</p>
                  </div>
                </li> : <></>
          }
        )
      }
      </ol>
    </div>
  );
};