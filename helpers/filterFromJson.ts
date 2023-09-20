export const findFromJson = (jsonArr: any[], key: any, josnKey: any) => {
  if (Array.isArray(jsonArr)) {
    let newJson = jsonArr.find((json) => {
      if (key == json[josnKey]) {
        return json;
      }
    });
    return newJson || {};
  }
  return {};
};

export const filterDrodownData = (data: any[], key: string, labelKey: string) => {
  let newDataData: any = [];
  data.map((item) => {
    if (item.status) {
      item.value = item[key];
      item.label = item[labelKey];
      item[key] && item[labelKey] && newDataData.push(item);
    }
  });

  return newDataData;
};
