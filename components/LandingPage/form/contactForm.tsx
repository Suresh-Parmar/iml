import React, { useState } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Flex,
  Textarea,
  Select,
  LoadingOverlay,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createContactUs } from "@/utilities/API";
import { setGetData } from "@/helpers/getLocalStorage";

export type ContactType = {
  name: string;
  email: string;
  mobileNumber: string;
  subject: string;
  city: string;
  message: string;
  answer: string;
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.white,
  },
  input: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[1] : theme.colors.dark[8],
  },
}));

function ContactForm() {
  let isDarkThem = setGetData("colorScheme");

  const { classes } = useStyles(isDarkThem);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
      subject: "",
      city: "",
      message: "",
      answer: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      email: (value) => (!/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : null),
      mobileNumber: (value) => {
        if (!value) {
          return "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          return "Invalid mobile number format (e.g., 9876543210)";
        }
        return null;
      },
      answer: (value) => (value !== "12" ? "Incorrect answer to the math question" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    let formValues = {
      ...values,
    };

    let data = await createContactUs(formValues);
    console.log("Successfully ", data);

    form.setValues({
      name: "",
      email: "",
      mobileNumber: "",
      subject: "",
      city: "",
      message: "",
      answer: "",
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="John Doe"
            {...form.getInputProps("name")}
            w={"100%"}
            mt={"md"}
            size="md"
            className={classes.input}
            onChange={(event) => {
              form.setFieldValue("name", event.currentTarget.value);
            }}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="example@example.com"
            {...form.getInputProps("email")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("email", event.currentTarget.value);
            }}
          />
          <Flex w={"100%"} gap={"15px"}>
            <TextInput
              withAsterisk
              label="Mobile Number"
              placeholder="123-456-7890"
              {...form.getInputProps("mobileNumber")}
              w={"50%"}
              mt={"md"}
              size="md"
              onChange={(event) => {
                form.setFieldValue("mobileNumber", event.currentTarget.value);
              }}
            />
            <TextInput
              label="City"
              placeholder="Enter city"
              {...form.getInputProps("city")}
              w={"50%"}
              mt={"md"}
              size="md"
              onChange={(event) => {
                form.setFieldValue("city", event.currentTarget.value);
              }}
            />
          </Flex>
          <TextInput
            label="Subject"
            placeholder="Enter subject"
            {...form.getInputProps("subject")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("subject", event.currentTarget.value);
            }}
          />

          <TextInput
            label="Message"
            placeholder="Enter your message"
            {...form.getInputProps("message")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("message", event.currentTarget.value);
            }}
          />

          <TextInput
            withAsterisk
            label="What is 3 + 9 = ?"
            placeholder="Your answer"
            {...form.getInputProps("answer")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("answer", event.currentTarget.value);
            }}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
export default ContactForm;
