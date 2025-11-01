import React from "react";
import I18n from "../../../utilities/translations";
import { useInvoiceQuoteContext } from "../InvoiceQuoteContext";
import { iInlineControls } from "./types";
import DeleteItem from "./DeleteItem";
import InputPrice from "../../_atoms/input/InputPrice";
import Switch from "../../_atoms/switch/Switch";
import TableMoreActions from "./TableMoreActions";

// This component handles the controls that live next to the inputs of a lineItem
// In all cases, there will be a icon button to delete the item. But if the user has
// specified that they need to, they have an option to toggle sales tax on or off for
// the given lineItem.
// The state and handlers for these controls are specified in the LineItemContent component
const InlineControls = ({
  allowSalesTaxExemptItems,
  formNameFor,
  handleDiscountChange,
  handleRemoveItem,
  item,
  itemIncludesSalesTax,
  handleIncludesSalesTaxChange,
  nestedFormDetails,
}: iInlineControls) => {
  const { includesSalesTax, inputPriceCurrencySign } = useInvoiceQuoteContext();

  const salesTaxFields = allowSalesTaxExemptItems ? (
    <Switch
      checked={itemIncludesSalesTax}
      onChange={handleIncludesSalesTaxChange}
      label={I18n.t("sales_tax.short_name")}
      stacked={true}
      name={formNameFor("includes_sales_tax", nestedFormDetails)}
    />
  ) : (
    <div className="tw-min-w-20">
      <InputPrice
        name={formNameFor("sales_tax", nestedFormDetails)}
        value={parseFloat(item.sales_tax).toFixed(2)}
        disabled={true}
        label={I18n.t("sales_tax.short_name")}
        currencySign={inputPriceCurrencySign}
      />
    </div>
  );

  return (
    <>
      {includesSalesTax && salesTaxFields}
      <div className="tw-hidden sm:tw-block">
        <DeleteItem onClick={() => handleRemoveItem(item)} model={item.model} description={item.updated_name} price={item.service_price} quantity={item.quantity} />
      </div>

      <div className="sm:tw-hidden tw-ml-auto">
        <TableMoreActions
          handleDiscountChange={handleDiscountChange}
          handleRemoveItem={() => handleRemoveItem(item)}
          price={item.service_price}
          model={item.model}
          description={item.updated_name}
          quantity={item.quantity}
        />
      </div>
    </>
  );
};

export default InlineControls;
