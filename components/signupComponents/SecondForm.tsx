import { MatrixDataType } from "@/components/Matrix";
import { filterDataSingle } from "@/helpers/dropDownData";
import { setGetData } from "@/helpers/getLocalStorage";
import { emailFormat, validatePhone } from "@/helpers/validations";
import { readLandingData } from "@/utilities/API";
import { Flex, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateinputCustom } from "../utils";
import { filterData } from "@/helpers/filterData";

type SecondFormProps = {
  form: any;
};

export default function SecondForm({ form }: SecondFormProps) {
  const [examCentersData, setExamCentersData] = useState<MatrixDataType>([]);

  let reduxData = useSelector((state: any) => state.data);

  async function readExamCentersData() {
    const examCenters = await readLandingData("exam_centers", "find_many", "mode", "Online");
    setExamCentersData(examCenters);
  }

  useEffect(() => {
    readExamCentersData();
  }, []);

  const examCentersNames = filterData(examCentersData, "label", "value", "exam_center_id");

  const onChangeExamCenter = async (event: any) => {
    form.setFieldValue("exam_center_code", event || "");
    const iExamCenter = examCentersData.find((i) => i.exam_center_id === event);
    form.setFieldValue("exam_id", iExamCenter?._id ?? "");
  };

  let selectedCountryLocal = setGetData("selectedCountry", "", true);
  let examData = examCentersData.find((x) => x.name === form.values.exam_center_code);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

  return (
    <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
      <Select
        clearable
        searchable
        nothingFound="No options"
        data={examCentersNames}
        label="Exam Center"
        name="Exam Center"
        mt={"md"}
        size="md"
        {...form.getInputProps("exam_center_code")}
        onChange={onChangeExamCenter}
        w={"100%"}
      />
      {examData?.examdate && (
        <span className="font12">
          Exam Date : {examData?.examdate} and Time : {examData?.time}
        </span>
      )}
      <TextInput
        withAsterisk
        label="Name"
        name="Name"
        placeholder="John Doe"
        {...form.getInputProps("name")}
        w={"100%"}
        mt={"md"}
        size="md"
        onChange={(event) => {
          form.setFieldValue("name", event.currentTarget.value);
        }}
      />
      <TextInput
        withAsterisk
        name="Mobile"
        label="Mobile"
        placeholder="9876320145"
        {...form.getInputProps("mobile_1")}
        w={"100%"}
        onChange={(e) => {
          let val = validatePhone(e.target.value, 10);
          form.setFieldValue("mobile_1", val);
        }}
        mt={"md"}
        size="md"
        icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
      />
      <TextInput
        // withAsterisk
        name="Alternate Mobile"
        label="Alternate Mobile"
        placeholder="9876320154"
        {...form.getInputProps("mobile_2")}
        w={"100%"}
        onChange={(e) => {
          let val = validatePhone(e.target.value, 10);
          form.setFieldValue("mobile_2", val);
        }}
        mt={"md"}
        size="md"
        icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
      />
      <TextInput
        withAsterisk
        name="Email"
        label="Email"
        {...form.getInputProps("email_1")}
        onChange={(e) => {
          let val = emailFormat(e.target.value);
          form.setFieldValue("email_1", val);
        }}
        placeholder="john.doe@ignitedmindlab.com"
        w={"100%"}
        mt={"md"}
        size="md"
      />
      <TextInput
        // withAsterisk
        name="Alternate Email"
        label="Alternate Email"
        {...form.getInputProps("email_2")}
        onChange={(e) => {
          let val = emailFormat(e.target.value);
          form.setFieldValue("email_2", val);
        }}
        placeholder="john.doe@ignitedmindlab.com"
        w={"100%"}
        mt={"md"}
        size="md"
      />
      <DateinputCustom
        inputProps={{
          popoverProps: {
            withinPortal: true,
          },
          withAsterisk: true,
          name: "Date of Birth (DoB)",
          label: "Date of Birth (DoB)",
          // placeholder: `${new Date(Date.now()).toDateString()}`,
          ...form.getInputProps("dob"),
          w: "100%",
          mt: "md",
          size: "md",
          maxDate: new Date(),
        }}
      />
      <Select
        clearable
        searchable
        name="Gender"
        nothingFound="No options"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("gender")}
        w={"100%"}
        label="Gender"
        placeholder="Select your gender"
        data={["Male", "Female"]}
      />
    </Flex>
  );
}
