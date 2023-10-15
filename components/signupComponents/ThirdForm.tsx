import { useEffect, useState } from "react";
import { MatrixDataType } from "@/components/Matrix";
import { readLandingData } from "@/utilities/API";
import { Checkbox, Flex, Select, TextInput, Textarea } from "@mantine/core";
import { Recaptcha } from "@/components/common";
import { filterDataSingle } from "@/helpers/dropDownData";

type ThirdFormProps = {
  form: any;
  setRecaptcha: (value: string) => void;
};

export default function ThirdForm({ form, setRecaptcha }: ThirdFormProps) {
  const [schoolsData, setSchoolsData] = useState<MatrixDataType>([]);
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);

  let { address } = form.values;

  async function readStatesData() {
    const states = await readLandingData("states", "find_many");
    setStatesData(states);
  }

  async function readCitiesData(stateName: string) {
    const cities = await readLandingData("cities", "find_many", "state", stateName);
    setCitiesData(cities);
  }

  async function readSchoolsData(stateName: string) {
    const schools = await readLandingData("schools", "find_many", "state", stateName);

    setSchoolsData(schools);
  }

  useEffect(() => {
    readStatesData();
  }, []);

  const schoolNames = filterDataSingle(schoolsData || [], "name");
  const stateNames = filterDataSingle(statesData || [], "name");
  const cityNames = filterDataSingle(citiesData || [], "name");

  const onChangeState = async (event: any) => {
    form.setFieldValue("state", event || "");
    const state = statesData.find((state) => state.name === event);
    await readCitiesData(state?.name ?? "");
    await readSchoolsData(state?.name ?? "");
  };

  const onChangeCities = async (event: any) => {
    form.setFieldValue("city", event || "");
  };

  return (
    <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
      <TextInput
        withAsterisk
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
        searchable
        nothingFound="No options"
        data={stateNames}
        label={"State"}
        name="State"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("state")}
        onChange={onChangeState}
        w={"100%"}
      />
      <Select
        disabled={form.values.state === ""}
        searchable
        nothingFound="No options"
        data={cityNames}
        name="City"
        label={"City"}
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("city")}
        onChange={onChangeCities}
        w={"100%"}
      />
      <Select
        searchable
        name="School"
        nothingFound="No options"
        mt={"md"}
        size="md"
        withAsterisk
        {...form.getInputProps("school_name")}
        onChange={(event) => {
          form.setFieldValue("school_name", event ?? "");
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
