import { TextInput, Checkbox, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createClass,
  createCompetition,
  createSchool,
  readBoards,
  readCities,
  readClasses,
  readCountries,
  readCountriesWithFlags,
  readSchools,
  readStates,
  updateClass,
} from "@/utilities/API";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

function ClassForm({
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
  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add Class`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name || "",
      status: rowData?.status ?? "",
      code: rowData?.code || "",
      roman_code: rowData?.roman_code || "",
      order_code: rowData?.order_code || "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      code: (value) => (value.length < 1 ? "Code must have at least 1 letters" : null),
      roman_code: (value) => (value.length < 1 ? "Roman Code must have at least 1 letters" : null),
      order_code: (value) => (value.length < 1 ? "Order Code must have at least 1 letters" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isClassUpdated = await updateClass(rowData._id, values);
      if (isClassUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const classes = await readClasses();
        setData(classes);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Class ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isClassCreated = await createClass(values as MatrixRowType);
      if (isClassCreated.toUpperCase() === "DOCUMENT CREATED") {
        const classes = await readClasses();
        setData(classes);
        setOLoader(false);
        notifications.show({
          title: `Class created!`,
          message: `A new class has been created.`,
          color: "green",
        });
      } else if (isClassCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Class already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: "",
      code: "",
      status: true,
    });
    close();
  };

  return (
    <Box maw={"100%"} mx="auto">
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
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Code"
            placeholder="Code 123"
            {...form.getInputProps("code")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Roman Code"
            placeholder="IX"
            {...form.getInputProps("roman_code")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Order Code"
            placeholder="2"
            {...form.getInputProps("order_code")}
            w={"100%"}
            mt={"md"}
            size="md"
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

export { ClassForm };
