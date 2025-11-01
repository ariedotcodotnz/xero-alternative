import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import LineItemLayout, { LineItem } from "./LineItemLayout";

const LineItemLayouts = ({ items }: { items: LineItem[] }) => {
  const [lineItems, setLineItems] = useState<LineItem[]>(items); // in production we will use the InvoiceQuoteContext
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const sortIds = lineItems.map((item) => item.sortID);
    if (active.id !== over.id) {
      const oldIndex = sortIds.indexOf(String(active.id));
      const newIndex = sortIds.indexOf(String(over.id));
      // reorder the lineitems and update the order attribute to match
      const reorderedItems = arrayMove(lineItems, oldIndex, newIndex).map((item: LineItem, index) => ({ ...item, order: (index + 1) }));
      setLineItems(reorderedItems);
    };
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={lineItems.map((item) => item.sortID)} strategy={verticalListSortingStrategy}>
          {lineItems
            .map((item) => (
              <LineItemLayout
                sortID={item.sortID}
                key={item.sortID}
                canToggleSalesTax={item.canToggleSalesTax}
                hasSalesTax={item.hasSalesTax}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                order={item.order}
              />
            ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default LineItemLayouts;
