export const setGetData = (key: any = "", value: any = "", isjsonVal: boolean = false) => {
  if (process.browser) {
    if (value) {
      if (isjsonVal) {
        value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
      return true;
    } else {
      let data: any = localStorage.getItem(key);
      try {
        if (isjsonVal) {
          data = JSON.parse(data);
        }
      } catch (e) {
        console.log(e);
      }

      return data;
    }
  }
};

export const clearLocalData = () => {
  if (process.browser) {
    localStorage.clear();
    sessionStorage.clear();
  }
};
