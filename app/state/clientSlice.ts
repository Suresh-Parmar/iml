import { createSlice } from '@reduxjs/toolkit';

type ReduxStateType = {
  showHeader: boolean;
  showFooter: boolean;
  showNavigationBar: boolean;
  hideNavigationBar: boolean;
  showAsideBar: boolean;
  applicationShellPadding: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 0;
  asideState: {
    title: string | undefined;
    form: React.ReactNode | undefined;
  };
  selectedCountry: {
    name: string;
    countryCode: string;
  };
};

const initialState: ReduxStateType = {
  showHeader: true,
  showFooter: false,
  showNavigationBar: false,
  hideNavigationBar: true,
  showAsideBar: false,
  applicationShellPadding: 'xs',
  asideState: {
    title: undefined,
    form: undefined,
  },
  selectedCountry: {
    name: '',
    countryCode: '',
  },
};

export const clientSlice = createSlice({
  name: 'Client',
  initialState,
  reducers: {
    ControlApplicationShellComponents: (state, action) => ({
      ...state,
      showAsideBar: action.payload.showAsideBar,
      showFooter: action.payload.showFooter,
      showHeader: action.payload.showHeader,
      showNavigationBar: action.payload.showNavigationBar,
      hideNavigationBar: action.payload.hideNavigationBar,
      asideState: {
        title: action.payload.asideState?.title,
        form: action.payload.asideState?.form,
      },
    }),
    UpdateApplicationShellPadding: (state, action) => ({
      ...state,
      applicationShellPadding: action.payload.applicationShellPadding,
    }),
    UpdateCountry: (state, action) => {
      return {
        ...state,
        selectedCountry: action.payload,
      };
    },
  },
});

export default clientSlice;
