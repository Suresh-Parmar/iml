export const filterData = (
  data: any[],
  key: string,
  val: string,
  findkey: any = "",
  sort: any = true,
  sortKey: any = "",
  setLabelKey: any = "name"
) => {
  let newData: any[] = [];
  if (Array.isArray(data)) {
    data.forEach((element: any) => {
      element[key] = element[setLabelKey];
      element[val] = findkey ? element[findkey] : element.name;
      if (element.group) {
        element.groupName = element.group;
        delete element.group;
      }

      if (element.status && element[key] && element[key] != "None") {
        let data = newData.find((elm) => elm[key] == element[key]);

        if (!data) {
          newData.push(element);
        }
      }
    });
  }

  if (sort) {
    return newData.sort((a: any, b: any) => {
      let fa = a.label.toLowerCase(),
        fb = b.label.toLowerCase();
      if (sortKey) {
        fa = a[sortKey].toLowerCase();
        fb = b[sortKey].toLowerCase();
      }

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }
  return newData;
};
