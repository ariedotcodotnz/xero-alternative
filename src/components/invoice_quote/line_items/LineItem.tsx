// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import isEqual from "lodash/isEqual";
import InputPrice from "../../_atoms/input/InputPrice";
import { round2Dp } from "../../utils/base_helper";
import Icon from "../../_atoms/icons/icon/Icon";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import InlineControls from "./InlineControls";
import AutoComplete from "../../_molecules/auto_complete/AutoComplete";
import { iLineItemAsProp } from "./types";

interface iLineItem {
  idForTest: string;
  item: iLineItemAsProp;
  handleRemoveItem: (item: iLineItemAsProp) => void;
  lineItemsAttributesName: string;
}

// Represents the UI for a single LineItem
const LineItem = ({
  item,
  handleRemoveItem,
  lineItemsAttributesName,
  idForTest,
}: iLineItem) => {
  const id = item.sortID;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    background: "white",
    boxShadow: isDragging ? "0 0 8px 2px rgba(0, 0, 0, 0.25)" : "",
    position: isDragging ? "relative" : "inherit",
    zIndex: isDragging ? 1000 : 0,
  };

  // Form value state
  const [serviceName, setServiceName] = useState(item.updated_name || "");
  const [serviceIsPredefined, setServiceIsPredefined] =
    useState<boolean>(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [itemIncludesSalesTax, setItemIncludesSalesTax] = useState(
    item.includes_sales_tax,
  );
  // Since the price of a line item is saved as either `service_price` or `price` for
  // Invoices and Quotes, respectively, to set the initial state we need to first need to check
  // which one exists and then set it to that value. If they are both null (i.e: a blank line)
  // then initialise the price as an empty string
  const [price, setPrice] = useState(() => {
    if (
      !quantity &&
      item.service_price &&
      item.service_price.length &&
      item.price &&
      item.price.length
    ) {
      return "";
    }

    if (Number.isFinite(item.service_price)) {
      return parseFloat(item.service_price).toFixed(2);
    }
    if (Number.isFinite(item.price)) {
      return parseFloat(item.price).toFixed(2);
    }
    return "";
  });

  const handleIncludesSalesTaxChange = (value) => {
    const { modelId, model } = item;

    setItemIncludesSalesTax(value);
    window.analytics.track(`${model}_line_item_gst_toggled`, {
      feature_code: "GST on Services",
      includes_gst: value,
      invoice_id: modelId || `new_draft_${model}`,
      line_item_id: id || "new_line_item",
    });
  };

  // Get the relevant values from context
  const {
    updateListItem,
    salesTaxRate,
    formNameFor,
    allowSalesTaxExemptItems,
    services,
    inputPriceCurrencySign,
  } = useInvoiceQuoteContext();

  // Every time any of the inputs on the LineItem change (i.e: the description, quantity, price, or GST-expemptness),
  // Make sure the values are formatted correctly, and publish the changes to the version of the item that lives in context
  useEffect(() => {
    // Make sure numbers are parsed and rounded appropriately.
    // If value exists, make parse it as a number so it can be rounded. If it fails parsing and turns into `NaN`, fallback to 0
    // If a value doesn't exist, just save it as an empty string
    const priceAsNumber = price ? round2Dp(parseFloat(price) || 0) : "";
    const quantityAsNumber = quantity
      ? round2Dp(parseFloat(quantity) || 0)
      : "";
    const salesTax = itemIncludesSalesTax
      ? round2Dp(priceAsNumber * salesTaxRate * quantityAsNumber) || 0
      : 0;

    // Contstruct a new Item with all the correct parsed and formatted values
    const newItem = {
      ...item,
      updated_name: serviceName,
      service_price: priceAsNumber,
      quantity: quantityAsNumber,
      total: round2Dp(priceAsNumber * quantityAsNumber),
      sales_tax: salesTax,
    };

    // Perform a deep comparison to make sure that somehow the newItem and existing one are not the same
    // then update the item in context if they are at all different
    if (!isEqual(newItem, item)) {
      updateListItem(newItem);
    }
    setServiceIsPredefined(
      !!services.find((service) => service[0] === serviceName),
    );
  }, [serviceName, quantity, price, itemIncludesSalesTax]);

  // Handles setting the internal quantity state value
  // It strips out the "," from number values
  const handleQuantityChange = ({ target }) => {
    setQuantity(target.value.replace(/\\,/g, ""));
  };

  // Handles setting the internal price state value
  // It strips out the "," from number values
  const handlePriceChange = (value) => {
    setPrice(value.replace(/\\,/g, ""));
  };

  // Handles setting the internal serviceName value, as well as the price if required
  // This gets fired when a dropdown option from Typedown is selected, NOT whenever
  // the input is typed in (see onType handler for Typedown for this). Typedown will
  // return a serviceId, which we lookup in the `services` value in context to get the name
  // and default price. We then update the price and serviceName which these values
  const handleServiceNameChange = (requestedServiceItem) => {
    // when clearing a service (incoming value is empty)
    if (!requestedServiceItem) {
      // when clearing a service, selected from list -> reset all fields
      if (serviceIsPredefined) {
        setServiceName("");
        setQuantity("1");
        setPrice("");
        setServiceIsPredefined(false);
      } else {
        // when service to be cleared, is custom (NOT from list) -> reset only service field
        setServiceName("");
      }
      return;
    }

    let selectedServiceName = requestedServiceItem.value;

    const selectedItem = services.find(
      (service) => service[1] === requestedServiceItem.key,
    );

    if (selectedItem) {
      const servicePrice = selectedItem[selectedItem.length - 1]["data-price"];
      selectedServiceName = selectedItem[0];
      setPrice(servicePrice);
      setServiceIsPredefined(true);
    }

    setServiceName(selectedServiceName);
  };

  const handleDiscountChange = () => {
    const currentPrice = price;

    if (currentPrice !== "" && !Number.isNaN(currentPrice)) {
      const applied = parseFloat(currentPrice) * -1.0;

      setPrice(applied.toFixed(2));
    }
  };

  // Shared input config for all inputs for the LineItem, and
  // the name for sales tax in the current jurisdiction
  const nestedFormDetails = {
    nestedAtributeFor: lineItemsAttributesName,
    index: item.order - 1,
  };

  const selectedService = services.find(
    (service) => service[0] === serviceName,
  );
  const selectedItem = selectedService
    ? {
      key: selectedService[1],
      value: selectedService[0],
    }
    : {
      key: null,
      value: serviceName,
    };

  return (
    <div
      className="tw-relative tw-flex tw-gap-2 sm:tw-gap-4 tw-p-2 tw-pb-4 tw-items-start tw-rounded-md tw-bg-white [&:not(:first-child)]:tw-pt-6 sm:!tw-pt-2 "
      style={style}
      ref={setNodeRef}
      data-testid={idForTest}
    >
      <div
        className="tw-flex tw-items-center hover:tw-text-gray-900 tw-cursor-pointer sm:tw-self-stretch"
        {...attributes}
        {...listeners}
        aria-label="Activate keyboard reordering by pressing the space bar, then use the arrow keys to move the item up and down"
      >
        <Icon type="DoubleEllipsisIcon" size="lg" classes="sm:tw-mt-7" />
      </div>
      <div className="tw-grow tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-start tw-gap-x-3 tw-gap-y-2">
        <div className="tw-basis-full sm:tw-pt-7">
          <AutoComplete
            hideLabel={true}
            items={services.map((service) => ({
              key: service[1],
              value: service[0],
            }))}
            label="Name"
            name={formNameFor("updated_name", nestedFormDetails)}
            openMenuOnFocus
            placeholder="Item/Service name"
            render="textarea"
            selectedItem={selectedItem}
            setSelectedItem={handleServiceNameChange}
          />
        </div>

        <div className="tw-flex tw-gap-2 sm:tw-gap-3 tw-items-end">
          <div className="tw-w-16">
            <label className="hnry-label" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="hnry-input !tw-text-clip no-bs"
              id="quantity"
              name={formNameFor("quantity", nestedFormDetails)}
              onChange={handleQuantityChange}
              inputMode="decimal"
              autoComplete="off"
              value={quantity}
              type="number"
              step="0.0001"
            />
          </div>
          <div className="tw-min-w-28">
            <InputPrice
              name={formNameFor("service_price", nestedFormDetails)}
              value={price}
              onChange={handlePriceChange}
              onBlur={handlePriceChange}
              label="Price"
              currencySign={inputPriceCurrencySign}
            />
          </div>
          <InlineControls
            {...{
              item,
              nestedFormDetails,
              itemIncludesSalesTax,
              handleRemoveItem,
              handleDiscountChange,
              formNameFor,
              allowSalesTaxExemptItems,
              handleIncludesSalesTaxChange,
            }}
          />
        </div>
      </div>
      <input
        type="hidden"
        name={formNameFor("quantity", nestedFormDetails)}
        value={item.quantity}
      />
      {item.id && (
        <input
          type="hidden"
          name={formNameFor("id", nestedFormDetails)}
          value={item.id}
        />
      )}
      <input
        type="hidden"
        name={formNameFor("service_id", nestedFormDetails)}
        value={item.service_id}
      />
      <input
        type="hidden"
        name={formNameFor("service_category", nestedFormDetails)}
        value={item.category}
      />
      <input
        type="hidden"
        name={formNameFor("sales_tax", nestedFormDetails)}
        value={item.sales_tax}
      />
      <input
        type="hidden"
        name={formNameFor("order", nestedFormDetails)}
        value={item.order}
      />
    </div>
  );
};

export default LineItem;
