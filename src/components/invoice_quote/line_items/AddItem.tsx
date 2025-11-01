import React from "react";
import Button from "../../_atoms/button/Button";

interface iAddItem {
  model: string;
  onClick: () => void;
}

const AddItem = ({ onClick, model }: iAddItem) =>
  <div className="tw-flex tw-flex-row-reverse md:tw-flex-none tw-mt-2">
    <Button
      classes="tw-max-w-fit"
      variant="link"
      iconType="PlusIcon"
      iconEnd
      onClick={onClick}
      dataTrackClick={{ eventName: `${model}_line_item_add_line` }}
    >
      Add line
    </Button>
  </div>

export default AddItem;
