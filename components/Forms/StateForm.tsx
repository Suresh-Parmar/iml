import { TextInput, Button, Group, Box, Flex, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createState, readCountries, readStates, updateState } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { filterDataSingle } from "@/helpers/dropDownData";

function StateForm({
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
  const [countriesData, setCountriesData] = useState<MatrixDataType>([]);

  async function readCountriesData() {
    const countries = await readCountries("status", true);
    setCountriesData(countries);
  }

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add State`);
    }
  }, []);

  useEffect(() => {
    readCountriesData();
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      status: rowData?.status ?? true,
      country: rowData?.country ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    values = { ...values };
    if (rowData !== undefined) {
      const isStateUpdated = await updateState(rowData._id, values);
      if (isStateUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const states = await readStates();
        setData(states);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `State ${rowData.name} updated!`,
        message: `The above state has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isStateCreated = await createState(values as MatrixRowType);
      if (isStateCreated.toUpperCase() === "DOCUMENT CREATED") {
        const states = await readStates();
        setData(states);
        setOLoader(false);
      } else if (isStateCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `State already exists!`,
          message: `${values.name} already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
      notifications.show({
        title: `State created!`,
        message: `A new state has been created.`,
        color: "green",
      });
    }
    form.setValues({
      name: "",
      country: "",
      status: true,
    });
    close();
  };

  const onChangeCountry = async (event: any) => {
    form.setFieldValue("country", event || "");
  };

  // const countryNames = countriesData.filter((c) => Boolean(c.status)).map((country) => country.name);

  const countryNames = filterDataSingle(countriesData || [], "name");

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
            dropdownPosition="bottom"
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

export { StateForm };
