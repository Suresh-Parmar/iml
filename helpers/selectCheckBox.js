export let selectCheckBOxData = (dataDefault, checked, id, allData, allDatakey) => {
  let data = dataDefault ? [...dataDefault] : [];
  if (id) {
    if (checked) {
      data.push(id);
    } else {
      let newData = [];
      data.map((item, index) => {
        if (item != id) {
          newData.push(item);
        }
      });
      return newData;
    }
  } else {
    if (checked) {
      allData.forEach((elm) => {
        data.push(elm[allDatakey]);
      });
    } else {
      return [];
    }
  }
  return data;
};

export const checkIsAllChecked = (data, allData) => {
  if (allData && data) {
    if (allData.length == data.length) {
      return true;
    }
  }
  return false;
};
