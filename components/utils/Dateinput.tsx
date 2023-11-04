import { DateInput } from "@mantine/dates";
import React from "react";

function DateinputCustom(props: { inputProps: any }) {
  let { inputProps } = props;
  let onChange = inputProps.onChange;
  let value = inputProps.value;

  const formattedDate = (date: any) => {
    let date1: any = new Date(date);
    if (date1 == "Invalid Date") {
      date1 = new Date();
    }

    return date1.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  };

  const parts = value.split("-");
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  let valueSet: any = new Date(year, month, day);

  if (valueSet == "Invalid Date") {
    valueSet = null;
  }

  return (
    <DateInput
      valueFormat="DD-MM-YYYY"
      placeholder={formattedDate("")}
      {...inputProps}
      onChange={(e) => {
        onChange(formattedDate(e));
      }}
      value={valueSet}
    />
  );
}

export default DateinputCustom;
