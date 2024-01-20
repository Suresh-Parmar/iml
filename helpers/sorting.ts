const sortData = (data: any, sortKey: string, order = false) => {
  return data.sort((a: any, b: any) => {
    let aValue = String(a[sortKey]).toLowerCase();
    let bValue = String(b[sortKey]).toLowerCase();

    if (!order) {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export { sortData };
