import React, { useMemo } from "react";
import { SequenceType, SortSelection, SortOption, SortDirection } from "./types";
import SEQUENCE_LABEL_COMPONENTS from "./TableFilterSequences";
import RadioButtonPopover from "../../_molecules/popover/RadioButtonPopover";

interface iSortPopover {
  items: SortOption[];
  onChange: (item: SortSelection) => void;
  activeDirection: string;
  activeKey: string;
}

const generateSequenceLabel = (
  sequenceType: SequenceType,
  direction: SortDirection,
) =>
  direction === "asc"
    ? `${SEQUENCE_LABEL_COMPONENTS[sequenceType].start} ${SEQUENCE_LABEL_COMPONENTS[sequenceType].connector} ${SEQUENCE_LABEL_COMPONENTS[sequenceType].end}`
    : `${SEQUENCE_LABEL_COMPONENTS[sequenceType].end} ${SEQUENCE_LABEL_COMPONENTS[sequenceType].connector} ${SEQUENCE_LABEL_COMPONENTS[sequenceType].start}`;

const SortPopover = ({
  items,
  onChange,
  activeDirection,
  activeKey,
}: iSortPopover) => {
  const options = useMemo(() => {
    const list = [];

    items.forEach(({ label, value, sequenceType }) =>
      ["asc", "desc"].forEach((direction) => {
        list.push({
          value: `${value}::${direction}`,
          name: `${label} (${generateSequenceLabel(sequenceType, direction as SortDirection)})`,
        })
      })
    );

    return list;
  }, [items]);

  const handleChange = (value) => {
    onChange({ key: value.split("::")[0], direction: value.split("::")[1] as SortDirection });
  };

  const formattedSelected = useMemo(() => {
    const selected = `${activeKey}::${activeDirection}`;
    const index = options.findIndex(({ value }) => value === selected);

    return options[index];
  }, [activeKey, activeDirection, options]);

  return (
    <div className="tw-min-w-[10rem] tw-hidden sm:tw-block" id="sort-by-popover">
      <RadioButtonPopover
        items={options}
        onChange={handleChange}
        selected={formattedSelected}
        ariaLabel="Sort by"
        id="sort-by-popover"
      />
    </div>
  );
};

export default SortPopover;
