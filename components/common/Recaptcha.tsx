import dynamic from "next/dynamic";
import React, { useRef, LegacyRef } from "react";
import { useMantineColorScheme } from "@mantine/core";

const ReCAPTCHABase = dynamic(
  async () => {
    const { default: RQ } = await import("react-google-recaptcha");

    function Func({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    }

    return Func;
  },
  {
    ssr: false,
  }
);

const Recaptcha = (props: any): any => {
  const { setRecaptcha, captchaSize } = props;
  const { colorScheme } = useMantineColorScheme();
  const recaptchaRef = useRef<LegacyRef<any>>(null);
  const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

  const renderRecaptcha = () => {
    return (
      <ReCAPTCHABase
        onExpired={() => {
          setRecaptcha("");
        }}
        onErrored={() => {
          setRecaptcha("");
        }}
        onChange={(captcha: string | null) => {
          setRecaptcha(captcha || "");
        }}
        theme={colorScheme}
        size={captchaSize || "compact"}
        ref={recaptchaRef}
        sitekey={RECAPTCHA_KEY}
        key={colorScheme}
      />
    );
  };

  return <div style={{ margin: "20px 0" }}>{renderRecaptcha()}</div>;
};

export default Recaptcha;
