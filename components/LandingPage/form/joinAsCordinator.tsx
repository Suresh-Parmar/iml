import React, { useState } from "react";
import { TextInput, Checkbox, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createCordinator } from "@/utilities/API";
import { Recaptcha } from "@/components/common";
import { Notifications } from "@mantine/notifications";

export type CordinatorFormType = {
  yourName: string;
  mobileNo: string;
  residenceNo: string;
  email: string;
  city: string;
  state: string;
  age: string;
  qualification: string;
  profession: string;
  otherInfo: string;
  mathAnswer: string;
};

function JoinAsCordinator() {
  const [recaptcha, setRecaptcha] = useState("");

  const form = useForm({
    initialValues: {
      yourName: "",
      mobileNo: "",
      residenceNo: "",
      email: "",
      city: "",
      state: "",
      age: "",
      qualification: "",
      profession: "",
      otherInfo: "",
      mathAnswer: "",
    },
    validate: {
      yourName: (value) => (value.length < 1 ? "Your Name is required" : null),
      mobileNo: (value) => {
        if (!value) {
          return "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          return "Invalid mobile number format (e.g., 9876543210)";
        }
        return null;
      },
      email: (value) => (!/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : null),
      city: (value) => (value.length < 1 ? "City is required" : null),
      mathAnswer: (value) => (value !== "13" ? "Incorrect answer to the math question" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    if (!recaptcha) {
      Notifications.show({
        title: `Invalid recaptcha!`,
        message: ``,
        color: "red",
      });
      return;
    }

    let formValues = {
      ...values,
    };

    let data = await createCordinator(formValues);
    console.log("Successfully ", data);
    form.setValues({
      yourName: "",
      mobileNo: "",
      residenceNo: "",
      email: "",
      city: "",
      state: "",
      age: "",
      qualification: "",
      profession: "",
      otherInfo: "",
      mathAnswer: "",
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            withAsterisk
            label="Your Name"
            placeholder="John Doe"
            {...form.getInputProps("yourName")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="example@example.com"
            {...form.getInputProps("email")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <Flex gap={"15px"} w={"100%"}>
            <TextInput
              label="Age"
              placeholder="Enter age"
              {...form.getInputProps("age")}
              w={"33%"}
              mt={"md"}
              size="md"
            />

            <TextInput
              withAsterisk
              label="Mobile No"
              placeholder="9876543210"
              {...form.getInputProps("mobileNo")}
              w={"33%"}
              mt={"md"}
              size="md"
            />

            <TextInput
              label="Residence No"
              placeholder="123-456-7890"
              {...form.getInputProps("residenceNo")}
              w={"33%"}
              mt={"md"}
              size="md"
            />
          </Flex>

          <Flex gap={"15px"} w={"100%"}>
            <TextInput
              withAsterisk
              label="City"
              placeholder="Enter city"
              {...form.getInputProps("city")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <TextInput
              label="State"
              placeholder="Enter state"
              {...form.getInputProps("state")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
          </Flex>

          <TextInput
            label="Qualification"
            placeholder="Enter qualification"
            {...form.getInputProps("qualification")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            label="Profession"
            placeholder="Enter profession"
            {...form.getInputProps("profession")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            label="Any Other information"
            placeholder="Enter additional information"
            {...form.getInputProps("otherInfo")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            withAsterisk
            label="What is 5 + 8 = ?"
            placeholder="Your answer"
            {...form.getInputProps("mathAnswer")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
        </Flex>

        <Recaptcha setRecaptcha={setRecaptcha} captchaSize="normal" />
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default JoinAsCordinator;
