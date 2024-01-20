const sortData = (data: any, sortKey: string, order = false) => {
  return data.sort((a: any, b: any) => {
    if (!order) {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    } else {
      return a[sortKey] < b[sortKey] ? 1 : -1;
    }
  });
};

export { sortData };
