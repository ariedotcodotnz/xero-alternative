// A function to help the <Datepicker /> component play nicely with React Hook Form
// Converts date to ISO8601 for use on back-end

import { format } from "date-fns";
import { UseFormSetValue, Path, PathValue } from "react-hook-form";

const onDateChange  = <T>(value: Date | null, setValue: UseFormSetValue<T>, name: Path<T>) => {
  if (value) {
    setValue(name, format(value, "yyyy-MM-dd") as PathValue<T, Path<T>>)
  }
}

export default onDateChange