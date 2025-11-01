import React from "react";
import Button from "@hui/_atoms/button/Button"
import { delinkScreens } from "./types";
import { banner } from "./translations";

const { button, paragraph, title } = banner

const DelinkedBanner = ({ setFlowState }: { setFlowState: (string: delinkScreens) => void }) => (
  <div className="alert alert-danger" role="alert" >
    <h2 className="hnry-heading hnry-heading--marketing-h1">{title}</h2>
    <p>
      {paragraph}
    </p>
    <Button type="button" onClick={() => setFlowState("continue_with_hnry")}>
      {button}
    </Button>
  </div>
);

export default DelinkedBanner
