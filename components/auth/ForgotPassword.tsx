import { validatePhoneOREmail } from "@/helpers/validations";
import { Box, TextInput } from "@mantine/core";
import React, { useState } from "react";

type ForgotPasswordProps = {
  registrationNo: string;
  setRegistrationNo: (value: string) => void;
  setIsForgotPassword: (value: any) => void;
  setError: (value: string) => void;
};

function ForgotPassword(props: ForgotPasswordProps) {
  const { registrationNo, setRegistrationNo, setIsForgotPassword, setError } = props;
  const [type, setType] = useState("email");
  return (
    <>
      <TextInput
        input-type={type}
        onChange={(event) => {
          setError("");
          let value = event.currentTarget.value;
          let handleValue = validatePhoneOREmail(value, 10, type);
          handleValue.type !== type && setType(handleValue.type);
          value = handleValue.value;
          setRegistrationNo(value);
        }}
        value={registrationNo}
        label="Registration number or email id"
        placeholder="9876543210"
        size="md"
      />

      <Box ta="end" mt={5}>
        <Box onClick={() => setIsForgotPassword(false)} ml="auto" pt={5} w="max-content">
          Login
        </Box>
      </Box>
    </>
  );
}

export default ForgotPassword;
