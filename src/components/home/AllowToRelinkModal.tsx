import React from "react"
import Button from "@hui/_atoms/button/Button";
import Modal from "@hui/_molecules/modal/Modal";
import { delinkScreens } from "./types";
import { allowToRelink } from "./translations";

interface iAllowToRelinkModal {
  allowToRelinkModalOpen: boolean;
  setAllowToRelinkModalOpen: (boolean) => void;
  setFlowState: (string: delinkScreens) => void;
  salesTaxRegistered: boolean;
}

const { noButton, noSalesTaxListHtml, paragraph, salesTaxListHtml, title, yesButton } = allowToRelink

const AllowToRelinkModal = ({ allowToRelinkModalOpen, setAllowToRelinkModalOpen, setFlowState, salesTaxRegistered }: iAllowToRelinkModal) => {
  const handleYes = () => {
    setFlowState("linked")
    setAllowToRelinkModalOpen(false)
  };

  const handleNo = () => {
    const nextState = salesTaxRegistered ? "sales_tax_proceed" : "how_to_proceed"
    setFlowState(nextState)
    setAllowToRelinkModalOpen(false)
  }

  const modalList = salesTaxRegistered ?
    salesTaxListHtml : 
    noSalesTaxListHtml

  return (
    <Modal
      closable={true}
      open={allowToRelinkModalOpen}
      setOpen={setAllowToRelinkModalOpen}
      title={title}
      includesFooter={false}
    >
      <div>
        <p>
          {paragraph}
        </p>
        {/* eslint-disable-next-line xss/no-mixed-html */}
        <div className="list-disc tw-prose-sm tw-prose-grey" dangerouslySetInnerHTML={{ __html: modalList }}></div>
      </div>
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between mt-1 hnry-dialog-panel-actions">
        <Button variant="primary" onClick={handleYes}>{yesButton}</Button>
        <Button variant="secondary" onClick={handleNo}>{noButton}</Button>
      </div>
    </Modal>
  )
}

export default AllowToRelinkModal
