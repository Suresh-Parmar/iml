import { setGetData, setGetDataSession } from "@/helpers/getLocalStorage";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

let color = setGetData("colorScheme");
let countryData = setGetData("selectedCountry", "", true) || {};
let userData = setGetData("userData", "", true) || {};
let selectedTabData = setGetDataSession("selectedTab");

const initialState: any = {
  showHeader: true,
  showFooter: false,
  showNavigationBar: false,
  hideNavigationBar: true,
  showAsideBar: false,
  applicationShellPadding: 0,
  asideState: {},
  selectedCountry: countryData,
  colorScheme: color || "light",
  userData: userData,
  selectedTab: selectedTabData || "",
  userClassOBJ: {},
};

export const counterSlice = createSlice({
  name: "allData",
  initialState,
  reducers: {
    setSelectedCountryRedux: (state, action: PayloadAction<any>) => {
      state.selectedCountry = action.payload;
    },
    changeColorTheme: (state, action) => {
      let color = state.colorScheme == "light" ? "dark" : "light";
      setGetData("colorScheme", color);
      state.colorScheme = color;
    },

    UpdateCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    UpdateUserRedux: (state, action) => {
      state.userData = action.payload;
    },

    selectedTabUpdate: (state, action) => {
      state.selectedTab = action.payload;
      setGetDataSession("selectedTab", state.selectedTab);
    },

    setUserClass: (state, action) => {
      state.userClassOBJ = action.payload;
    },

    ControlApplicationShellComponents: (state, action) => {
      state.showAsideBar = action.payload.showAsideBar;
      state.showFooter = action.payload.showFooter;
      state.showHeader = action.payload.showHeader;
      state.showNavigationBar = action.payload.showNavigationBar;
      state.hideNavigationBar = action.payload.hideNavigationBar;
      state.asideState = {
        title: action.payload.asideState?.title,
        form: action.payload.asideState?.form,
      };
    },
  },
});

export const {
  setSelectedCountryRedux,
  UpdateUserRedux,
  changeColorTheme,
  UpdateCountry,
  ControlApplicationShellComponents,
  selectedTabUpdate,
  setUserClass,
} = counterSlice.actions;

export default counterSlice.reducer;
