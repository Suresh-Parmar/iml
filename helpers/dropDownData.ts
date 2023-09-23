export const filterDataMulti = (
  data: any,
  label: any = "name",
  value: any = "value",
  plusLabel: any = "",
  plusLabelStr: any = "",
  sort: any = true
) => {
  let newData: any = [];
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      if (!!item[label] && item.status) {
        let obj = {
          label: item[label],
          value: item[value],
        };

        if (plusLabel) {
          obj.label += " (" + plusLabel + " " + item[plusLabelStr] + ")";
        }
        newData.push(obj);
      }
    });
  }

  if (sort) {
    let sortData = newData.sort((a: any, b: any) => {
      let fa = a.label.toLowerCase(),
        fb = b.label.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    return sortData;
  }

  return newData;
};

export let filterDataSingle = (
  data: any,
  key: string,
  extra: any = "",
  extraKey: any = "",
  sort: boolean = true
): any[] => {
  let newData: any[] = [];
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      if (item[key] && item.status && item[key] != "nan" && String(item[key]).toLowerCase() != "none") {
        if (extra) {
          let data = item[key];
          data += " (" + extra + " " + item[extraKey] + ")";
          newData.push(data);
        } else {
          newData.push(item[key]);
        }
      }
    });
  }
  if (sort) {
    return newData.sort();
  } else {
    return newData;
  }
};
