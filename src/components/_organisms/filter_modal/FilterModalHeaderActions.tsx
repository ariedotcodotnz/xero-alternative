import React from "react";
import Icon from "../../_atoms/icons/icon/Icon";

interface SortTemplate {
  onRemoveAll: () => void;
  screen: string;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}

const HeaderActions = ({
  screen,
  setScreen,
  onRemoveAll,
}: SortTemplate) =>
  screen === "index" ? (
    <button
      onClick={onRemoveAll}
      className="tw-text-blue-600 tw-text-sm"
      key="remove-all-btn"
    >
      Remove all
    </button>
  ) : (
    <button
      className="hnry-button hnry-button--link !tw-w-auto"
      onClick={() => setScreen("index")}
    >
      <Icon type="ChevronLeftIcon" hoverOn classes="!tw-mx-0" />
      <span className="tw-sr-only">Back to previous screen</span>
    </button>
  );

export default HeaderActions;
