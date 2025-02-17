import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <head>
        <link href="https://fonts.cdnfonts.com/css/c39hrp48dhtt" rel="stylesheet"></link>
        <link href="https://fonts.cdnfonts.com/css/calibri-light" rel="stylesheet" />
        <title> IML </title>
      </head>
      <body>
        <Main />
        <NextScript />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        ></Script>
      </body>
    </Html>
  );
}
