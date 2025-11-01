import React from "react";
import Input from "../_atoms/input/Input";

interface iPurchaseOrderField {
  poNumber: string;
  setPoNumber: (value: string) => void;
}

const PurchaseOrderField = ({ poNumber, setPoNumber }: iPurchaseOrderField) => (
  <div>
    <label htmlFor="po_number" className="hnry-label">
      Purchase Order
      <span className="tw-hidden sm:tw-inline"> or Reference</span> Number
    </label>
    <Input
      name="invoice[po_number]"
      value={poNumber || ""}
      setValue={setPoNumber}
      labelRendered={false}
      id="po_number"
    />
  </div>
);

export default PurchaseOrderField;
