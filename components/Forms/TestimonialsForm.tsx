import { TextInput, Button, Group, Box, Flex, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readApiData, uploadMedia } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { FileInput } from "../utils";

function TestimonialsForm({
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
    initialValues: { ...rowData },
    validate: {
      name: (value: any) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  const submitImage = async (values: any) => {
    const payload: any = new FormData();
    payload.append("file", form.values.thumbnail);
    setOLoader(true);
    await uploadMedia(payload)
      .then((res) => {
        setOLoader(false);
        if (res.data.actual_url) {
          form.setFieldValue("thumbnail", res.data.actual_url ?? "");
          values.thumbnail = res.data.actual_url;
          onHandleSubmit(values);
        } else {
          notifications.show({
            message: "Unable to process.",
            autoClose: 8000,
          });
        }
      })
      .catch((err) => {
        setOLoader(false);
        console.log(err);
      });
  };

  const onHandleSubmit = async (values: any) => {
    if (typeof values.thumbnail == "object") {
      submitImage(values);
      return;
    }

    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await dynamicDataUpdate("testimonials", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readApiData("testimonials");
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Testimonial ${rowData.name} updated!`,
        message: `The above board has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("testimonials", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readApiData("testimonials");
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Testimonial created!`,
          message: `A new Testimonial has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Testimonial already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }
    form.setValues({
      name: "",
      school: "",
      description: "",
      country: "",
      startdate: "",
      enddate: "",
      thumbnail: "",
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
        label: "School",
        placeholder: "School Name",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("school"),
      },
      {
        inputType: "file",
        accept: "image/*",
        disabled: readonly,
        withAsterisk: true,
        label: "Thumbnail",
        placeholder: "thumbnail",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("thumbnail"),
      },
      {
        data: [
          { label: "Student", value: "student" },
          { label: "Teacher", value: "teacher" },
        ],
        inputType: "dropdown",
        disabled: readonly,
        withAsterisk: true,
        label: "Role",
        placeholder: "Role",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("role"),
      },
      {
        inputType: "editor",
        readonly: readonly,
        withAsterisk: true,
        label: "Description",
        placeholder: "Description",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("description"),
      },
    ];

    return formData.map((item: any, index) => {
      if (item.inputType == "editor") {
        return <Editor key={index} {...item} />;
      } else if (item.inputType == "file") {
        return <FileInput key={index} {...item} />;
      } else if (item.inputType == "dropdown") {
        return (
          <Select
            key={index}
            disabled={readonly}
            searchable
            nothingFound="No options"
            mt={"md"}
            size="md"
            w={"100%"}
            {...item}
          />
        );
      } else {
        return <TextInput key={index} {...item} />;
      }
    });
  };

  return (
    <Box maw={"100%"} mx="auto" mb="sm">
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

export { TestimonialsForm };
