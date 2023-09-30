import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readAnnoucements } from "@/utilities/API";
import { DateInput, DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";

function AnnouncementsForm({
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
      status: rowData?.status ?? "",
      capital: rowData?.capital ?? "",
      whatsnew: rowData?.whatsnew ?? "",
      enddate: rowData?.enddate ?? "",
      role: rowData?.role ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await dynamicDataUpdate("announcements", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readAnnoucements();
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Announcement ${rowData.name} updated!`,
        message: `The above board has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("announcements", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readAnnoucements();
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Announcement created!`,
          message: `A new Announcement has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Announcement already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: "",
      capital: "",
      whatsnew: "",
      enddate: "",
      role: "",
      status: true,
    });
    close();
  };

  let renderFormData = () => {
    let formData = [
      {
        disabled: readonly || !!rowData,
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
        label: "Role",
        placeholder: "Admin",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("role"),
      },
      {
        disabled: readonly,
        withAsterisk: true,
        label: "Capital",
        placeholder: "capital",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("capital"),
      },
      {
        inputType: "editor",
        readOnly: readonly,
        withAsterisk: true,
        label: "What's new",
        placeholder: "whatsnew",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("whatsnew"),
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

export { AnnouncementsForm };
