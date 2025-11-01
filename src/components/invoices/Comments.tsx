import React from "react";
import TextArea from "../_atoms/textarea/Textarea";
import I18n from "../../utilities/translations";

const ctx = { scope: "invoices.form" };

interface iComments {
  comments: string;
  setComments: (value: string) => void;
}

const Comments = ({ comments, setComments }: iComments) => (
  <div className="sm:tw-col-span-2">
    <TextArea
      label={I18n.t("comments", ctx)}
      name="invoice[comments]"
      value={comments}
      setValue={setComments}
      id="comments"
      note={I18n.t("comments_hint_legacy", ctx)}
      maxLength={5000}
    />
  </div>
);

export default Comments;
