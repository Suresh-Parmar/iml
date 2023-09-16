import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readApiData } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";

function GroupsForm({
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
      setFormTitle(`Add Group`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      code: rowData?.code ?? "",
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
      const isBoardUpdated = await dynamicDataUpdate("groups", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readApiData("groups");
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Group ${rowData.name} updated!`,
        message: `The above Group has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("groups", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readApiData("groups");
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Group created!`,
          message: `A new Group has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Group already exists!`,
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
        withAsterisk: true,
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

export { GroupsForm };
