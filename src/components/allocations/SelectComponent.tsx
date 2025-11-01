import React, {  useState } from "react";
import Select from "../_atoms/select/Select";

const SelectComponent = (args) => {

  const [selected, setSelected] = useState(args.selectedValue);

  const handleChange = (value: string) => {
    setSelected(value);
  }

  return <Select {...args} selectedValue={selected} onChange={handleChange} />;
};

export default SelectComponent;
