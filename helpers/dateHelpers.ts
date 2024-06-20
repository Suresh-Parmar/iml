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

export const handleDropDownChange = (
  e: any,
  key: any,
  allData: any,
  setAllData: any,
  clear?: any,
  val: any = ""
) => {
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

export const formatDateString = (inputDateStr: any) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the input date string into a Date object
  const date = new Date(inputDateStr);

  // Extract year, month, and day from the Date object
  const year = date.getFullYear() - 1; // Subtract 1 year
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = date.getDate();

  // Format month and day to ensure they have two digits
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // Construct the output date string in 'YYYY-MM-DD' format
  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
};
