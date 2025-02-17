import { notifications } from "@mantine/notifications";
import Excel from "exceljs";
import { saveAs } from "file-saver";

export const validatePhone = (
  val: string,
  len: number = 0,
  maxVal: any = 0,
  allowDot: any = false,
  oldVal: any = ""
): string => {
  let regex: any = /[^0-9]/g;
  let filteredValue: any;

  if (allowDot) {
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      filteredValue = val;
    } else {
      filteredValue = oldVal;
    }
  } else {
    filteredValue = val.replace(regex, "");
  }
  if (len && filteredValue.length > len) {
    filteredValue = filteredValue.slice(0, len);
  }

  if (maxVal && maxVal < filteredValue) {
    return maxVal;
  }

  return filteredValue;
};

export const validateAlpha = (val: string, isStr: any = false, len: number = 0): string => {
  let filteredValue;
  if (isStr) {
    filteredValue = val.replace(/[^a-zA-Z]/g, "");
  } else {
    filteredValue = val.replace(/[^a-zA-Z0-9]/g, "");
  }

  if (len && filteredValue.length > len) {
    filteredValue = filteredValue.slice(0, len);
  }

  return filteredValue;
};

export const emailFormat = (val: string): string => {
  let value = val.replaceAll(/[^a-zA-Z0-9._%+\-@]/g, "");
  return value;
};

export const calculatePhoneLen = (str: any) => {
  if (String(str).includes("+")) {
    return 13 - String(str).length;
  } else if (String(str).length) {
    return 12 - String(str).length;
  } else {
    return 10;
  }
};

export const validatePhoneOREmail = (val: any, len: number, inputType: any) => {
  let type = inputType;
  val = val.trim();
  if (val.length < 4) {
    if (isNaN(+val)) {
      type = "email";
    } else {
      type = "phone";
    }
  } else {
    if (type == "phone") {
      val = validatePhone(val, 10);
    } else {
      val = val.replaceAll(/[^a-zA-Z0-9._%+\-@]/g, "");
    }
  }

  return { value: val, type: type };
};

export const checkValidEmailOrNot = (email: string) => {
  const pattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return pattern.test(email);
};

export const checkValidCred = (val: string) => {
  if (isNaN(+val)) {
    return checkValidEmailOrNot(val);
  } else {
    return val.length == 10;
  }
};

const filterDataByString = (data: any, filterString: any) => {
  let newData = data.filter((item: any) => {
    return Object.values(item).some((value: any) => {
      return value.toString().toLowerCase().includes(filterString.toLowerCase());
    });
  });

  return newData;
};

export const saveExcel = async (fetchData: any, data: any, filterString: any, fileName: any, hideMsg: any = false) => {
  const workbook = new Excel.Workbook();
  const workSheetName = "Worksheet-1";

  let dataTOexport = fetchData || data;

  if (!dataTOexport.length) {
    if (!hideMsg) {
      notifications.show({
        message: "No Data to Export",
      });
    }
    return;
  }

  try {
    const worksheet = workbook.addWorksheet(workSheetName);

    const firstData = dataTOexport[0];
    const sortedKeys = Object.keys(firstData);

    const columns = sortedKeys.map((value) => ({
      header: value,
      key: value,
    }));

    data = filterString ? filterDataByString(data, filterString) : dataTOexport;

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };

    worksheet.columns.forEach((column: any) => {
      column.width = column.header.length + 5;
      column.alignment = { horizontal: "center" };
    });

    data.forEach((singleData: any) => {
      worksheet.addRow(singleData);
    });

    worksheet.eachRow({ includeEmpty: false }, (row: any) => {
      const currentCell = row._cells;

      currentCell.forEach((singleCell: any) => {
        const cellAddress = singleCell._address;

        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), `${fileName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
  } finally {
    workbook.removeWorksheet(workSheetName);
  }
};

export const maxLength = (text: string, len: number) => {
  if (text.length > len) {
    text = text.substring(0, len);
  }
  return text;
};

export let selectMinDate = (minDate: number = 2) => {
  if (minDate == 0) {
    return new Date();
  }

  return new Date(new Date().setFullYear(new Date().getFullYear() - minDate));
};

export const checkValidDate = (date: any, returnVal: any = null, str: any = false): any => {
  if (!date) {
    return null;
  }

  if (String(new Date(date)) == "Invalid Date") {
    return returnVal || null;
  } else {
    if (str) {
      return new Date(date).toString();
    } else {
      return new Date(date);
    }
  }
};
