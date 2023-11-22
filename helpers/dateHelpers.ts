export const dateInputHandler = (value: any) => {
  let parts = value;
  let day: any, month: any, year: any, valueSet: any;

  if (value && String(value).includes("-")) {
    value = String(value);
    parts = value.split("-");

    if (String(parts[0]).length > 2) {
      day = parseInt(parts[2]);
      month = parseInt(parts[1]) - 1;
      year = parseInt(parts[0]);
    } else {
      day = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      year = parseInt(parts[2]);
    }
    valueSet = new Date(year, month, day);
  } else {
    valueSet = parts ? new Date(parts) : null;
  }

  return valueSet;
};

export const handleDropDownChange = (e: any, key: any, allData: any, setAllData: any, clear?: any, val: any = "") => {
  if (clear) {
    if (clear == "all") {
      setAllData({ [key]: e });
    } else {
      setAllData({ ...allData, [clear]: val, [key]: e });
    }
  } else {
    setAllData({ ...allData, [key]: e });
  }
};
