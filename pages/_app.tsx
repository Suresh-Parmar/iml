import "./globals.css";
import { Inter } from "next/font/google";
import UIConfigurationProvider from "./state";
import ApplicationShell from "@/components/ApplicationShell";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ Component }: any) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    return (
      <Provider store={store}>
        <UIConfigurationProvider>
          <ApplicationShell>
            <Component />
          </ApplicationShell>
        </UIConfigurationProvider>
      </Provider>
    );
  } else {
    return;
  }
}
