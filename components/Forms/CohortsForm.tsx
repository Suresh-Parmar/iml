import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readApiData } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";

function CohortsForm({
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
      setFormTitle(`Add cohort`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      code: rowData?.code ?? "",
      context: rowData?.context ?? "",
      status: rowData?.status ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await dynamicDataUpdate("cohorts", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readApiData("cohorts");
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Cohort ${rowData.name} updated!`,
        message: `The above Cohort has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("cohorts", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readApiData("cohorts");
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Cohort created!`,
          message: `A new Cohort has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Cohort already exists!`,
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
      context: "",
      status: true,
    });
    close();
  };

  let renderFormData = () => {
    let formData = [
      {
        disabled: readonly,
        withAsterisk: true,
        label: "Name",
        placeholder: "John Die",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("name"),
      },
      {
        disabled: readonly,
        label: "Context",
        placeholder: "Context",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("context"),
      },
      {
        disabled: readonly,
        label: "Code",
        placeholder: "CODE",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("code"),
      },
    ];

    return formData.map((item: any, index) => {
      if (item.inputType == "editor") {
        return <Editor key={index} {...item} />;
      } else {
        return <TextInput key={index} {...item} />;
      }
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          {renderFormData()}
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

export { CohortsForm };
