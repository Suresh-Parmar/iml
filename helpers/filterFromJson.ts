export const findFromJson = (jsonArr: any[], key: any, josnKey: any) => {
  let newJson = jsonArr.find((json) => {
    if (key == json[josnKey]) {
      return json;
    }
  });
  return newJson || {};
};
