import React, { useState } from "react";
import { TextInput, Checkbox, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createRegisteration } from "@/utilities/API";
export type CordinatorFormType = {
  yourName: string;
  yourEmail: string;
  yourMobileNo: string;
  youAre: string;
  schoolName: string;
  schoolAddress: string;
  schoolEmail: string;
  schoolContactNo: string;
  schoolPrincipalName: string;
  schoolCoordinatorName: string;
  examsHeld: string;
  otherInfo: string;
  mathAnswer: string;
};
import { Recaptcha } from "@/components/common";
import { Notifications } from "@mantine/notifications";

function SchoolRegistrationForm() {
  const [recaptcha, setRecaptcha] = useState("");

  const form = useForm({
    initialValues: {
      yourName: "",
      yourEmail: "",
      yourMobileNo: "",
      youAre: "",
      schoolName: "",
      schoolAddress: "",
      schoolEmail: "",
      schoolContactNo: "",
      schoolPrincipalName: "",
      schoolCoordinatorName: "",
      examsHeld: "",
      otherInfo: "",
      mathAnswer: "",
    },
    validate: {
      yourName: (value) => (value.length < 1 ? "Your Name is required" : null),
      yourEmail: (value) => (!/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : null),
      yourMobileNo: (value) => {
        if (!value) {
          return "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          return "Invalid mobile number format (e.g., 9876543210)";
        }
        return null;
      },
      youAre: (value) => (value.length < 1 ? "Please select your role" : null),
      schoolName: (value) => (value.length < 1 ? "School Name is required" : null),
      mathAnswer: (value) => (value !== "18" ? "Incorrect answer to the math question" : null),
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
    let data = await createRegisteration(formValues);
    console.log("Successfully ", data);
    form.setValues({
      yourName: "",
      yourEmail: "",
      yourMobileNo: "",
      youAre: "",
      schoolName: "",
      schoolAddress: "",
      schoolEmail: "",
      schoolContactNo: "",
      schoolPrincipalName: "",
      schoolCoordinatorName: "",
      examsHeld: "",
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
            label="Your Email Id"
            placeholder="example@example.com"
            {...form.getInputProps("yourEmail")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <Flex gap={"15px"} w={"100%"}>
            <Select
              withAsterisk
              label="You are"
              placeholder="Select"
              {...form.getInputProps("youAre")}
              w={"100%"}
              mt={"md"}
              size="md"
              data={[
                { label: "School Principal", value: "schoolPrincipal" },
                { label: "Teacher", value: "teacher" },
                { label: "Parent", value: "parent" },
              ]}
            />
            <TextInput
              withAsterisk
              label="Your Mobile No"
              placeholder="9876543210"
              {...form.getInputProps("yourMobileNo")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
          </Flex>

          <TextInput
            withAsterisk
            label="School Name"
            placeholder="Enter school name"
            {...form.getInputProps("schoolName")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            label="School Address"
            placeholder="Enter school address"
            {...form.getInputProps("schoolAddress")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            label="School Email Id"
            placeholder="example@example.com"
            {...form.getInputProps("schoolEmail")}
            w={"100%"}
            mt={"md"}
            size="md"
          />

          <TextInput
            label="School Contact No"
            placeholder="123-456-7890"
            {...form.getInputProps("schoolContactNo")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <Flex gap={"15px"} w={"100%"}>
            <TextInput
              label="School Principal’s Name"
              placeholder="Enter principal's name"
              {...form.getInputProps("schoolPrincipalName")}
              w={"50%"}
              mt={"md"}
              size="md"
            />

            <TextInput
              label="School Coordinator’s Name"
              placeholder="Enter coordinator's name"
              {...form.getInputProps("schoolCoordinatorName")}
              w={"50%"}
              mt={"md"}
              size="md"
            />
          </Flex>

          <TextInput
            label="Which competitive exams are held in your school?"
            placeholder="Enter competitive exams"
            {...form.getInputProps("examsHeld")}
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
            label="What is 10 + 8 = ?"
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

export default SchoolRegistrationForm;
