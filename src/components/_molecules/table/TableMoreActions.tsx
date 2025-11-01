import React from "react";
import MoreActions from "../dropdowns/more_actions/MoreActions";
import MenuItem from "../dropdowns/menu/MenuItem";

interface iActions {
  label: string;
  iconType?: string;
  url: string;
  method?: HttpMethod;
  disabled: boolean;
  confirmText?: string;
  remote?: string;
  id?: string,
}

type iActionsType = iActions[];

interface iTableMoreActions {
  actions: iActionsType,
  modelId: number,
}

const TableMoreActions = ({
  actions,
  modelId,
}: iTableMoreActions) => (
  <MoreActions>
    {actions.map((item, i) => {
      const {
        label, iconType, url, method, disabled, confirmText, remote, id,
      } = item;

      if (disabled) { return null; }

      return (
        <MenuItem
          href={url}
          label={label}
          iconType={iconType}
          method={method}
          confirm={confirmText || undefined}
          remote={remote}
          key={`table-actions-${i}-${modelId}`}
          id={id}
        />
      );
    })}
  </MoreActions>
);

export default TableMoreActions;
