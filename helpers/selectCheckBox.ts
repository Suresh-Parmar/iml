export let selectCheckBOxData = (dataDefault: any, checked: any, id: any, allData: any, allDatakey: any) => {
  let data: any = dataDefault ? [...dataDefault] : [];
  if (id) {
    if (checked) {
      data.push(id);
    } else {
      let newData: any = [];
      data.map((item: any) => {
        if (item != id) {
          newData.push(item);
        }
      });
      return newData;
    }
  } else {
    if (checked) {
      allData.forEach((elm: any) => {
        data.push(elm[allDatakey]);
      });
    } else {
      return [];
    }
  }
  return data;
};

export const checkIsAllChecked = (data: any, allData: any) => {
  if (allData && data) {
    if (allData.length == data.length) {
      return true;
    }
  }
  return false;
};
