import { TextInput, Checkbox, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createBoard,
  createCompetition,
  createSchool,
  readBoards,
  readCities,
  readCountries,
  readCountriesWithFlags,
  readSchools,
  readStates,
  updateBoard,
} from "@/utilities/API";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

function BoardForm({
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
      setFormTitle(`Add Board`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      code: rowData?.code ?? "",
      status: rowData?.status ?? "",
      board_type: rowData?.board_type ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      code: (value) => (value.length < 1 ? "Code must have at least 1 letters" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await updateBoard(rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readBoards();
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Board ${rowData.name} updated!`,
        message: `The above board has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await createBoard(values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readBoards();
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Board created!`,
          message: `A new board has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Board already exists!`,
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
      board_type: "",
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
            disabled={readonly || !!rowData}
            withAsterisk
            label="Name"
            placeholder="Indian Certificate of Secondary Education"
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
            placeholder="ICSE"
            {...form.getInputProps("code")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <TextInput
            disabled={readonly}
            label="Board Type"
            {...form.getInputProps("board_type")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("board_type", event.currentTarget.value);
            }}
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

export { BoardForm };
