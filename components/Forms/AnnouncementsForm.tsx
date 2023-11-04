import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readAnnoucements, readApiData } from "@/utilities/API";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { checkValidDate } from "@/helpers/validations";

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
      whatsnew: rowData?.whatsnew ?? "",
      status: rowData?.status ?? "",
      newsdate: checkValidDate(rowData?.newsdate, null),
      enddate: checkValidDate(rowData?.enddate, null),
      summary: rowData?.summary || "",
      //
      // capital: rowData?.capital ?? "",
      // role: rowData?.role ?? "",
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
        const boards = await readApiData("announcements");
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
        const boards = await readApiData("announcements");
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
      whatsnew: "",
      enddate: "",
      status: true,
      summary: "",
      newsdate: "",
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
      {
        disabled: readonly,
        withAsterisk: true,
        label: "Summary",
        placeholder: "Summary",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("summary"),
      },
      {
        inputType: "date",
        disabled: readonly,
        label: "End Date",
        placeholder: new Date(Date.now()).toDateString(),
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("enddate"),
      },
      {
        inputType: "date",
        disabled: readonly,
        label: "News Date",
        placeholder: new Date(Date.now()).toDateString(),
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("newsdate"),
      },
    ];

    return formData.map((item: any, index) => {
      if (item.inputType == "editor") {
        return <Editor key={index} {...item} />;
      } else if (item.inputType == "date") {
        return (
          <DateInput
            key={index}
            popoverProps={{
              withinPortal: true,
            }}
            valueFormat="DD-MM-YYYY"
            w={"100%"}
            mt={"md"}
            size="md"
            {...item}
          />
        );
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
