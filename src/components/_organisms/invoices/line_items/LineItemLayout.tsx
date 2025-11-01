import React, { CSSProperties, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Icon from "../../../_atoms/icons/icon/Icon";
import AutoComplete from "../../../_molecules/auto_complete/AutoComplete";
import Switch from "../../../_atoms/switch/Switch";
import DecimalInput from "../../../_atoms/input/DecimalInput";
import TableMoreActions from "../../../invoice_quote/line_items/TableMoreActions";
import { iLineItemAsProp } from "../../../invoice_quote/line_items/types";


// The LineItemLayout is not a production ready component but sets up the basic structure for the LineItem component.
// It will be used to create the final LineItem component.
// From the original props and contexts we likely need to update as follows:
// Via Props:
// index
// item -> lineItem (or spread the item into props),

// Via Context:
// handleRemoveItem -> removeLineItem,
// lineItemsAttributesName -> namePrefix
// updateListItem -> updateLineItem,
// salesTaxRate
// allowSalesTaxExemptItems,
// services,

// Via Import:
// formNameFor,

// Can be removed:
// descColClasses // Should be determined by mediaqueries
// hideGstOnMobile // Should be determined by mediaqueries

export type Service = {
  category: string;
  id: number;
  name: string;
  price: number;
  salesTax: number;
};

export type LineItem = {
  canToggleSalesTax?: boolean;
  hasSalesTax?: boolean;
  name: string;
  price: number;
  quantity: number;
  sortID: string;
  order: number;
};

interface invoiceContextForLineItem {
  removeLineItem: (lineItem: iLineItemAsProp) => void;
  updateLineItem: (lineItem: iLineItemAsProp) => void;
  namePrefix: string;
  salesTaxName: string;
  salesTaxRate: number;
  allowSalesTaxExemptItems: boolean;
  services: Service[];
  item: iLineItemAsProp;
}

/* eslint-disable no-console */
// This block emulates what the useInvoiceContext hook should return in a real application.
const useInvoiceContext = (): invoiceContextForLineItem => ({
  removeLineItem: (lineItem) => console.log(`REMOVE lineItem ${lineItem.updated_name}`),
  updateLineItem: (lineItem) => console.log(`UPDATE lineItem ${lineItem.updated_name}`),
  namePrefix: "invoice_items_attributes",
  salesTaxName: "GST",
  salesTaxRate: 0.15,
  allowSalesTaxExemptItems: true,
  services: [
    {
      category: "Eating",
      id: 64725,
      name: "Cheese eating",
      price: 128.7,
      salesTax: 19.31,
    },
    {
      category: "Drinking",
      id: 75884,
      name: "Wine drinking",
      price: 98.7,
      salesTax: 16.31,
    },
  ],
  item: {
    model: "invoice",
    modelId: 1231,
    quantity: "",
    service_price: "11.30",
    updated_name: "name",
    sales_tax: "0",
    order: 1,
    service_id: 1232,
    category: "category",
    total: "21.23",
  }
});
/* eslint-enable no-console */

const LineItemLayout = ({
  canToggleSalesTax = false,
  hasSalesTax = false,
  price,
  quantity,
  sortID,
}: LineItem) => {
  const { salesTaxName, salesTaxRate, services, removeLineItem, item } = useInvoiceContext();
  const id = sortID;
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
    boxShadow: isDragging ? "0 0 10px 5px rgba(0, 0, 0, 0.05)" : "",
    position: isDragging ? "relative" : "inherit",
    zIndex: isDragging ? 1000 : 0,
  };

  const [tempSalesTax, setTempSalesTax] = useState(hasSalesTax);
  const [tempValue, setTempValue] = useState({ key: null, value: "" });
  const setPrice = (newPrice: number) => {
    // eslint-disable-next-line no-console
    console.log("Some call to updateLineItem or similar with ", {
      price: newPrice,
    });
  };

  const handleDiscountChange = () => {
    // eslint-disable-next-line no-console
    console.log("handleDiscountChange");
  };

  return (
    <div
      className="tw-flex tw-gap-4 tw-p-2 tw-bg-white"
      ref={setNodeRef}
      style={style}
    >
      <div className="tw-flex tw-items-center" {...attributes} {...listeners}>
        <Icon type="DoubleEllipsisIcon" />
      </div>
      <div className="tw-grow tw-flex tw-flex-col sm:tw-flex-row tw-gap-4">
        <div className="tw-basis-full">
          <AutoComplete
            id="serviceName"
            name="serviceName"
            items={services.map((service) => ({
              key: service.id,
              value: service.name,
            }))}
            label="Name"
            placeholder="Item/Service name"
            render="textarea"
            selectedItem={tempValue}
            setSelectedItem={setTempValue}
          />
        </div>
        <div className="tw-flex tw-gap-4 tw-items-end">
          <div className="tw-w-16">
            <label className="hnry-label" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="hnry-input"
              defaultValue={quantity}
              id="quantity"
              name="quantity"
            />
          </div>
          <div className="tw-min-w-28">
            <DecimalInput
              label={`Price excl. ${salesTaxName}`}
              name="price"
              onChange={(v) => setPrice(Number(v.replaceAll(/,/g, "")))}
              value={String(price)}
            />
          </div>
          {canToggleSalesTax ? (
            <Switch
              checked={tempSalesTax}
              onChange={setTempSalesTax}
              label={salesTaxName}
              stacked={true}
            />
          ) : (
            hasSalesTax && (
              <div className="tw-min-w-20">
                <DecimalInput
                  label={salesTaxName}
                  name="salesTax"
                  onChange={(v) => setPrice(Number(v.replaceAll(/,/g, "")))}
                  readOnly={true}
                  value={String(price * salesTaxRate)}
                />
              </div>
            )
          )}

          <div className="tw-hidden sm:tw-block">
            <button
              className="hnry-button hnry-button--danger !tw-pl-4 !tw-pr-2"
              aria-label="Delete this lineitem"
            >
              <Icon type="TrashIcon" />
            </button>
          </div>
          <div className="sm:tw-hidden tw-ml-auto">
            <TableMoreActions
              price={item.price || item.service_price}
              handleDiscountChange={handleDiscountChange}
              handleRemoveItem={() => removeLineItem(item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemLayout;
