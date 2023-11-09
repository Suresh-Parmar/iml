import { DateInput } from "@mantine/dates";
import React from "react";

function DateinputCustom(props: { inputProps: any; inputBox?: any }) {
  let { inputProps, inputBox } = props;
  let onChange = inputProps.onChange;
  let value = inputProps.value;

  const formattedDate = (date: any) => {
    let date1: any = new Date(date);
    if (date1 == "Invalid Date") {
      date1 = new Date();
    }

    return date1.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  };

  let parts = value;
  let day: any, month: any, year: any, valueSet: any;

  if (value.includes("-")) {
    parts = value.split("-");
    day = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1;
    year = parseInt(parts[2]);
    valueSet = new Date(year, month, day);
  } else {
    valueSet = new Date(parts);
  }

  if (valueSet == "Invalid Date") {
    valueSet = null;
  }

  if (inputBox) {
    return (
      <div className="mb-1 row">
        <label className="col-form-label p-0 capitalize">{inputProps.label}</label>
        <input
          className="form-control"
          {...inputProps}
          onChange={(e) => {
            onChange(formattedDate(e));
          }}
          value={formattedDate(valueSet)}
        />
      </div>
    );
  } else {
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
}

export default DateinputCustom;
