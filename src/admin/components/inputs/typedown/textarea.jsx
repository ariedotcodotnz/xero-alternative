import React from "react";
import TextareaAutosize from "react-textarea-autosize";

const Textarea = (props) => (
    <TextareaAutosize
      style={{ transition: "all 0.3s ease" }}
      {...props}
      className="md-textarea"
    />
);

export default Textarea;
