import { TextInput, Button, Group, Box, Flex, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createCity, readCities, readCountries, readDataCustomFilter, readStates, updateCity } from "@/utilities/API";

import { notifications } from "@mantine/notifications";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";

function CityForm({
  open,
  close,
  setData,
  setRowData,
  rowData,
  setFormTitle,
  readonly,
}: {
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: any;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [countriesData, setCountriesData] = useState<MatrixDataType>([]);
  const [oLoader, setOLoader] = useState<boolean>(false);

  async function readCountriesData() {
    const countries = await readCountries("status", true);
    setCountriesData(countries);
  }

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states: MatrixDataType;
    if (filterBy && filterQuery) {
      states = await readDataCustomFilter("states", "find_many", {
        [filterBy]: filterQuery,
        status: true,
      });
    } else {
      states = await readStates();
    }

    setStatesData(states);
  }

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add City`);
    }
  }, []);

  useEffect(() => {
    if (rowData?.country_id) {
      let findJson = findFromJson(countriesData, rowData.country_id, "_id");
      readStatesData("country", findJson.name);
    }
  }, [!!countriesData.length, rowData?.country_id]);

  useEffect(() => {
    readCountriesData();
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      state_id: rowData?.state_id ?? "",
      country_id: rowData?.country_id ?? "",
      status: rowData?.status ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      state_id: (value) => (value.length === 0 ? "State must be selected" : null),
      country_id: (value) => (value.length === 0 ? "Country must be selected" : null),
    },
  });

  let formvalues: any = form.values;

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    values = { ...values };
    if (rowData !== undefined) {
      const isCityUpdated = await updateCity(rowData._id, values);
      if (isCityUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const cities = await readCities();
        setData(cities);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `City ${rowData.name} updated!`,
        message: `The above city has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isCityCreated = await createCity(values as MatrixRowType);
      if (isCityCreated.toUpperCase() === "DOCUMENT CREATED") {
        const cities = await readCities();
        setData(cities);
        setOLoader(false);
        notifications.show({
          title: `City created!`,
          message: `A new city has been created.`,
          color: "green",
        });
      } else if (isCityCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `City already exists!`,
          message: `${values.name} already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: "",
      state_id: "",
      country_id: "",
      status: true,
    });
    close();
  };

  const onChangeCountry = async (event: any) => {
    form.setFieldValue("country_id", event ?? "");
    form.setFieldValue("state_id", "");
    let findJson = findFromJson(countriesData, event, "_id");
    await readStatesData("country", findJson.name ?? "");
  };

  // const stateNames = statesData.filter((c) => Boolean(c.status)).map((state) => state.name);
  const stateNames = filterData(statesData, "label", "value", "_id");
  const countryNames = filterData(countriesData, "label", "value", "_id");

  // const countryNames = countriesData.filter((c) => Boolean(c.status)).map((country) => country.name);

  return (
    <Box maw={"100%"} mx="auto" mih={500}>
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Name"
            placeholder="John Doe"
            {...form.getInputProps("name")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("name", event.currentTarget.value);
            }}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={countryNames}
            label={"Country"}
            name="Country"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("country_id")}
            onChange={onChangeCountry}
            w={"100%"}
          />
          <Select
            clearable
            disabled={readonly || formvalues.country_id === ""}
            searchable
            nothingFound="No options"
            data={stateNames}
            label={"State"}
            name="State"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("state_id")}
            onChange={async (event) => {
              form.setFieldValue("state_id", event ?? "");
            }}
            w={"100%"}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export { CityForm };
