import React from "react";
import Button from "@hui/_atoms/button/Button";

interface ClientFlowButtonsProps {
  optionButtonOneText: string;
  optionButtonTwoText: string;
  optionButtonOneOnClick?: () => void;
  optionButtonTwoOnClick?: () => void;
  optionButtonOneDisabled?: boolean;
}

const ClientFlowButtons = ({
  optionButtonOneText,
  optionButtonTwoText,
  optionButtonOneOnClick,
  optionButtonTwoOnClick,
  optionButtonOneDisabled = false,
}: ClientFlowButtonsProps) => (
  <>
    <Button
      variant="tertiary"
      classes="tw-w-full tw-font-semibold tw-mb-4"
      onClick={optionButtonOneOnClick}
      dataTestId="optionButtonOne"
      disabled={optionButtonOneDisabled}
    >
      {optionButtonOneText}
    </Button>
    <Button
      variant="tertiary"
      classes="tw-w-full tw-font-semibold"
      onClick={optionButtonTwoOnClick}
      dataTestId="optionButtonTwo"
    >
      {optionButtonTwoText}
    </Button>
  </>
);

export default ClientFlowButtons;
