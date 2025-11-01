import React from "react";
import MoreActions from "../../_molecules/dropdowns/more_actions/MoreActions";
import MenuItem from "../../_molecules/dropdowns/menu/MenuItem";
import I18n from "../../../utilities/translations";

interface iTableMoreActions {
  handleDiscountChange: () => void;
  handleRemoveItem: (item: object) => void;
  price: string;
  model?: "invoice" | "quote";
  description?: string;
  quantity?: string;
}

const TableMoreActions = ({
  handleDiscountChange,
  handleRemoveItem,
  price,
  model = "invoice",
  description,
  quantity,
}: iTableMoreActions) => {
  const discountApplied = price !== "" && Number(price) < 0;
  const DiscountText = discountApplied
    ? I18n.t("invoices.form.line_items.more_actions.remove_discount")
    : I18n.t("invoices.form.line_items.more_actions.apply_discount");

  const DiscountIcon = discountApplied ? "XMarkIcon" : "PlusIcon";
  const disabled = price === "" || Number(price) === 0;

  return (
    <MoreActions>
      <MenuItem
        onClick={handleDiscountChange}
        label={DiscountText}
        iconType={DiscountIcon}
        asButton
        disabled={disabled}
      />
      <MenuItem
        onClick={handleRemoveItem}
        label={I18n.t("invoices.form.line_items.more_actions.delete")}
        iconType="TrashIcon"
        asButton
        trackClick={{
          eventName: `${model}_line_item_delete`,
          data: { description, price, quantity },
        }}
      />
    </MoreActions>
  );
};
export default TableMoreActions;
