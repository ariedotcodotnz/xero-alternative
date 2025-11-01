// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState, useMemo, useRef } from "react";
import clone from "lodash/clone";
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
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import LineItem from "./LineItem";
import AddItem from "./AddItem";
import { iLineItems } from "./types";

// A component to encapsulate the logic and UI for the LineItems (InvoiceItems and QuoteItems) that
// exist on an Invoice or Quote. Line Items can be added, removed, edited, and reordered on an
// Invoice or Quote and the logic for all of these actions belongs in this component.
// Like the rest of the Invoice and Quote components, it uses the InvoiceQuoteContext
// as its source of truth
const LineItems = ({ lineItemsAttributesName, model }: iLineItems) => {
  // The defaultService is what gets added to the Form as a new line when the "Add line" button is pressed
  const [defaultService, setDefaultService] = useState<iItem | undefined>(
    undefined,
  );
  const [hideGstOnMobile, setHideGstOnMobile] = useState(false);

  // Grab the relevant values out of the context
  const {
    allowSalesTaxExemptItems,
    includesSalesTax,
    lineItems,
    modelId,
    salesTaxRate,
    services,
    setLineItems,
    status,
    removedLineItems,
    setRemovedLineItems,
  } = useInvoiceQuoteContext();

  useEffect(() => {
    if (window.innerWidth < window.breakpoints.mobileMax) {
      setHideGstOnMobile(true);
    }
  }, []);

  // Pretty much an onMount effect
  // This handles:
  // - Making sure we have a valid `defaultService` so that new lines can be added
  useEffect(() => {
    if (services) {
      const firstActiveService = services[0];
      const formattedService: iItem = {
        archived: false,
        updated_name: "",
        service_id: firstActiveService[1],
        category: firstActiveService[2]["data-category"],
        service_price: "",
        quantity: "",
        modelId,
        model,
        total: 0,
        sales_tax: 0,
        order: lineItems.length + 1,
      };
      setDefaultService(formattedService);
    }
  }, [services]);

  // This handles:
  // - Making sure lineItems are sorted by `order

  const initialSortDone = useRef(false);
  useEffect(() => {
    // If there are any lineItems, make sure they're sorted properly
    if (lineItems.length > 0 && initialSortDone.current === false) {
      let updated = lineItems.slice();
      updated = updated.sort((a, b) => a.order > b.order);

      // recalculate sales_tax if user registered as sales tax after the invoice is created
      if (status === "DRAFT") {
        updated = updated.map((lineItem) => {
          const { sales_tax, total, includes_sales_tax } = lineItem;

          let recalculateSalesTax = 0;
          if (includesSalesTax && sales_tax == 0 && includes_sales_tax) {
            recalculateSalesTax = total * salesTaxRate;
          } else if (!includesSalesTax && sales_tax != 0) {
            recalculateSalesTax = 0;
          } else {
            recalculateSalesTax = sales_tax;
          }

          return { ...lineItem, sales_tax: recalculateSalesTax };
        });
      }
      initialSortDone.current = true;
      setLineItems(updated);
    }
  }, [lineItems]);

  // Handles adding a new item to the list of LineItems
  const addNewItem = () => {
    if (!defaultService) {
      return;
    }

    // Determines what the `order` number for the new item should be
    let currentHighestOrderNumber = 0;

    if (lineItems.length) {
      currentHighestOrderNumber = Math.max(
        Math.max(...lineItems.map(({ order }) => order)),
        0,
      ); // Double Math.max to make sure 0 is the lowest possible order
    }
    const nextOrderNumber = currentHighestOrderNumber + 1;
    // Using the `defaultService`, create a baseline for the new lineItem,
    // then set all values on it as required
    const newItem = clone(defaultService);
    newItem.order = nextOrderNumber;
    newItem.quantity = String(1);
    newItem.total =
      parseFloat(newItem.service_price) * parseFloat(newItem.quantity) || 0;
    newItem.sortID = crypto.randomUUID();
    (newItem.sales_tax = includesSalesTax ? newItem.total * salesTaxRate : 0),
      (newItem.includes_sales_tax = includesSalesTax);

    setLineItems([...lineItems, newItem]);
  };

  // Pretty much an onMount effect
  // We want an Invoice/Quote to have one blank line by default so users can start working on it quickly
  // To do this, we wait untill the `defaultService` is set, and if there are no lineItems,
  // we add a blank one to start off the Invoice/Quote.
  // We wait for defaultService to be set because at the time that it is set, we know that all the lineItems
  // have been loaded. If they've all been loaded and the length is still 0, we know to add a starter line
  useEffect(() => {
    if (!lineItems.length && defaultService) {
      addNewItem();
    }
  }, [defaultService]);

  // Removes a LineItem from the list of lineItems.
  // Essentially we just filter out the provided item by removing the item that has the matching `order`.
  // `removedLineItems` gets updated too so that we can keep track of any persisted items that need to be
  // destroyed on the server
  const removeItem = (item) => {
    // Filters out null values, i.e.: items that had not been passed in as props and need to be removed
    const filteredItems = lineItems.filter((itm) => itm.sortID !== item.sortID);

    setLineItems(filteredItems);
    setRemovedLineItems([...removedLineItems, item]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const sortIds = lineItems.map((item) => item.sortID);
    if (active.id !== over.id) {
      const oldIndex = sortIds.indexOf(active.id);
      const newIndex = sortIds.indexOf(over.id);
      // reorder the lineitems and update the order attribute to match
      const reorderedItems = arrayMove(lineItems, oldIndex, newIndex).map(
        (item: iItem, index) => ({ ...item, order: index + 1 }),
      );

      setLineItems(reorderedItems);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const descColClasses = useMemo(() => {
    if (allowSalesTaxExemptItems) {
      return "col-7";
    }

    if (includesSalesTax && !hideGstOnMobile) {
      return "col-6";
    }

    return "col-7 col-sm-8";
  }, [allowSalesTaxExemptItems, includesSalesTax, hideGstOnMobile]);

  return (
    <section>
      <div
        className="line-items -tw-mx-2 tw-my-2"
        data-testid="updated-line-items"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={lineItems.map((item) => item.sortID)}
            strategy={verticalListSortingStrategy}
          >
            {lineItems
              .filter((item) => !item._destroy)
              .map((item, index) => (
                <LineItem
                  key={item.sortID}
                  idForTest={`line-item-${index}`}
                  {...{ item, index, lineItemsAttributesName }}
                  handleRemoveItem={removeItem}
                  descColClasses={descColClasses}
                  hideGstOnMobile={hideGstOnMobile}
                />
              ))}
          </SortableContext>
        </DndContext>
        {/* Outside from the main LineItems output, a hidden input is created for each persisted removed lineItem
          so it can be destroyed on the server */}
        {removedLineItems.map(
          (itm) =>
            itm.id && (
              <input
                key={`removed-item-${itm.id}`}
                type="hidden"
                name={`${itm.model}[${itm.model}_items_to_destroy_ids][]`}
                value={itm.id}
              />
            ),
        )}
      </div>
      <AddItem onClick={addNewItem} model={model} />
    </section>
  );
};

export default LineItems;
