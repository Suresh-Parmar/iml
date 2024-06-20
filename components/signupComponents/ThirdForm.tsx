import { useEffect, useState } from "react";
import { MatrixDataType } from "@/components/Matrix";
import { readLandingData } from "@/utilities/API";
import { Checkbox, Flex, Select, TextInput, Textarea } from "@mantine/core";
import { Recaptcha } from "@/components/common";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";

type ThirdFormProps = {
  form: any;
  setRecaptcha: (value: string) => void;
  setOtherValues?: any;
  otherValues?: any;
  state?: any;
  city?: any;
  school?: any;
};

export default function ThirdForm({ form, setRecaptcha, setOtherValues, otherValues ,  state,
  city,
  school}: ThirdFormProps) {
  const [schoolsData, setSchoolsData] = useState<MatrixDataType>([]);
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);

  let { address } = form.values;

  // async function readStatesData() {
  //   const states = await readLandingData("states", "find_many");
  //   setStatesData(states);
  // }

  async function readStatesData() {
    const states = await readLandingData("states", "find_many");
    setStatesData(states);

    console.log("state", state);
    if (state !== "") {
      form.setFieldValue("state_id", state);
      form.setFieldValue("city_id", city);
      form.setFieldValue("school_id", school);

      const states = await readLandingData("states", "find_many");

      let stateValue = findFromJson(states, state, "_id");
      otherValues.state = stateValue.name;

      const cities = await readLandingData(
        "cities",
        "find_many",
        "state_id",
        stateValue._id
      );

      let cityValue = findFromJson(cities, city, "_id");
      otherValues.city = cityValue.name;

      const schools = await readLandingData(
        "schools",
        "find_many",
        "city_id",
        cityValue._id
      );

      let schoolData = findFromJson(schools, school, "_id");
      otherValues.school_name = schoolData.name;
    }
  }

  async function readCitiesData(stateName: string) {
    const cities = await readLandingData("cities", "find_many", "state_id", stateName);
    setCitiesData(cities);
  }

  async function readSchoolsData(cityName: string) {
    const schools = await readLandingData("schools", "find_many", "city_id", cityName);
    setSchoolsData(schools);
  }

  useEffect(() => {
    readStatesData();
  }, []);

  useEffect(() => {
    form.values.city_id && readSchoolsData(form.values.city_id || "");
  }, [form?.values?.city_id]);

  useEffect(() => {
    form.values.state_id && readCitiesData(form.values.state_id || "");
  }, [form?.values?.state_id]);

  const schoolNames = filterData(schoolsData, "label", "value", "_id");
  const stateNames = filterData(statesData, "label", "value", "_id");
  const cityNames = filterData(citiesData, "label", "value", "_id");

  const onChangeState = async (event: any) => {
    if (setOtherValues && otherValues) {
      let stateValue = findFromJson(statesData, event, "_id");
      otherValues.state = stateValue.name;
    }

    form.setFieldValue("state_id", event || "");
    form.setFieldValue("city_id", "");
    // const state = statesData.find((state) => state.name === event);
    // await readCitiesData(state?.name ?? "");
  };

  const onChangeCities = async (event: any) => {
    if (setOtherValues && otherValues) {
      let cityValue = findFromJson(citiesData, event, "_id");
      otherValues.city = cityValue.name;
    }

    form.setFieldValue("city_id", event || "");
    form.setFieldValue("school_id", "");
  };

  return (
    <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
      <TextInput
        // withAsterisk
        name="Section"
        label="Section"
        placeholder="Example: A"
        mt={"md"}
        size="md"
        {...form.getInputProps("section")}
        w={"100%"}
      />
      <div className="w-100 position-relative">
        <Textarea
          placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
          label="Address"
          {...form.getInputProps("address")}
          withAsterisk
          name="Address"
          autosize
          minRows={3}
          w={"100%"}
          mt={"md"}
          size="md"
        />
        <div className="position-absolute" style={{ right: 5, bottom: 1 }}>
          {address.length}
        </div>
      </div>
      <Select
        clearable
        searchable
        nothingFound="No options"
        data={stateNames}
        label={"State"}
        name="State"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("state_id")}
        onChange={onChangeState}
        w={"100%"}
      />
      <Select
        clearable
        disabled={form.values.state_id === ""}
        searchable
        nothingFound="No options"
        data={cityNames}
        name="City"
        label={"City"}
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("city_id")}
        onChange={onChangeCities}
        w={"100%"}
      />
      <Select
        clearable
        searchable
        name="School"
        nothingFound="No options"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("school_id")}
        onChange={(event) => {
          if (setOtherValues && otherValues) {
            let schoolData = findFromJson(schoolsData, event, "_id");
            otherValues.school_name = schoolData.name;
          }
          form.setFieldValue("school_id", event ?? "");
        }}
        w={"100%"}
        label="School"
        data={schoolNames}
      />
      <TextInput
        withAsterisk
        label="Pin-Code"
        name="Pin-Code"
        placeholder="780004"
        {...form.getInputProps("pincode")}
        w={"100%"}
        mt={"md"}
        size="md"
      />
      <Recaptcha setRecaptcha={setRecaptcha} captchaSize="normal" />
      <Checkbox
        mt="md"
        label="I provide consent to Ignited Mind Lab to communicate with me via WhatsApp, SMS, E-Mail and Phone."
        {...form.getInputProps("consented", { type: "checkbox" })}
      />
    </Flex>
  );
}
