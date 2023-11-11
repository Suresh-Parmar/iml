export const dateInputHandler = (value: any) => {
  let parts = value;
  let day: any, month: any, year: any, valueSet: any;

  if (value && String(value).includes("-")) {
    value = String(value);
    parts = value.split("-");
    day = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1;
    year = parseInt(parts[2]);
    valueSet = new Date(year, month, day);
  } else {
    valueSet = parts ? new Date(parts) : null;
  }

  return valueSet;
};
