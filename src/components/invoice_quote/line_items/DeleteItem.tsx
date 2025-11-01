import React from "react";
import Icon from "../../_atoms/icons/icon/Icon";

interface iDeleteItem {
  model: string;
  description: string;
  price: string;
  quantity: string;
  onClick: (item: object) => void;
}

const DeleteItem = ({ onClick, model, description, price, quantity }: iDeleteItem) => (
  <button
    onClick={onClick}
    data-track-click={JSON.stringify({ eventName: `${model}_line_item_delete_line`, data: {description, price, quantity} })}
    className="hnry-button hnry-button--link"
    type="button"
  >
    <span className="tw-sr-only">Delete line item</span>
    <Icon
      type="TrashIcon"
      classes="tw-text-red-500 !tw-bg-red-100 hover:!tw-bg-red-200 !tw-mr-0"
    />
  </button>
);

export default DeleteItem;
