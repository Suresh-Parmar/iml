import { TextInput, Button, Group, Box, Flex, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createCity, readCities, readCountries, readDataCustomFilter, readStates, updateCity } from "@/utilities/API";

import { notifications } from "@mantine/notifications";

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
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [countriesData, setCountriesData] = useState<MatrixDataType>([]);

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
    if (rowData?.country) {
      readStatesData("country", rowData.country);
    }
  }, [rowData?.country]);

  useEffect(() => {
    readCountriesData();
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      state: rowData?.state ?? "",
      country: rowData?.country ?? "",
      status: rowData?.status ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      state: (value) => (value.length === 0 ? "State must be selected" : null),
      country: (value) => (value.length === 0 ? "Country must be selected" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

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
      state: "",
      country: "",
      status: true,
    });
    close();
  };

  const onChangeCountry = async (event: any) => {
    form.setFieldValue("country", event ?? "");
    form.setFieldValue("state", "");
    await readStatesData("country", event ?? "");
  };

  const stateNames = statesData.filter((c) => Boolean(c.status)).map((state) => state.name);

  const countryNames = countriesData.filter((c) => Boolean(c.status)).map((country) => country.name);

  return (
    <Box maw={"100%"} mx="auto" mih={500}>
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            disabled={readonly || rowData != undefined}
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
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={countryNames}
            label={"Country"}
            name="Country"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("country")}
            onChange={onChangeCountry}
            w={"100%"}
          />
          <Select
            disabled={readonly || form.values.country === ""}
            searchable
            nothingFound="No options"
            data={stateNames}
            label={"State"}
            name="State"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("state")}
            onChange={async (event) => {
              form.setFieldValue("state", event ?? "");
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
