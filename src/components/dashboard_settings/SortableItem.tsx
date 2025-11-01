/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from "@dnd-kit/utilities";
import ModuleItem, { ModuleItemProps } from "./ModuleItem";

const SortableItem = ({ id, dashedBorder, moduleData }: ModuleItemProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <ModuleItem
      id={id}
      ref={setNodeRef}
      moduleData={moduleData}
      style={style}
      withOpacity={isDragging}
      attributes={attributes}
      dashedBorder={dashedBorder}
      listeners={listeners}
    />
  );
};

export default SortableItem;
