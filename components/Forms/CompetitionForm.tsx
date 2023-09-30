import { TextInput, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createCompetition, readCompetitions, readData, updateCompetition } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { getReduxState } from "@/redux/hooks";
import Editor from "../editor/editor";

function CompetitionForm({
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
  const [subjects, setSubjects] = useState<MatrixDataType>();

  const readSubjects = async () => {
    const data = await readData("subjects", "find_many", "status", true);
    setSubjects(data);
  };

  useEffect(() => {
    readSubjects();
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add competition`);
    }
  }, []);

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      status: rowData?.status ?? "",
      subject_id: rowData?.subject_id ?? "",
      parent_competition_id: rowData?.parent_competition_id ?? "",
      code: rowData?.code ?? "",
      tags: rowData?.tags ?? "",
      mode_id: rowData?.mode_id ?? "",
      message: rowData?.message ?? "",
    },

    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      subject_id: (value) => (value.length < 2 ? "Subject must have at least 2 letters" : null),
      parent_competition_id: (value) => (value.length < 2 ? "Parent competition must have at least 2 letters" : null),
      code: (value) => (value.length < 1 ? "Code must have at least 1 letters" : null),
      mode_id: (value) => (value.length === 0 ? "Mode must be selected" : null),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  const getSelectedCountry = () => {
    const state = getReduxState();
    return state.client.selectedCountry.name;
  };

  const onHandleSubmit = async (values: any) => {
    values = { ...values, country_id: getSelectedCountry() };
    setOLoader(true);
    if (rowData !== undefined) {
      const isCompetitionUpdated = await updateCompetition(rowData._id, values);
      if (isCompetitionUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const competitions = await readCompetitions();
        setData(competitions);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Competition ${rowData.name} updated!`,
        message: `The above competition has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isCompetitionCreated = await createCompetition(values as MatrixRowType);
      if (isCompetitionCreated.toUpperCase() === "DOCUMENT CREATED") {
        const competitions = await readCompetitions();
        setData(competitions);
        setOLoader(false);
      } else if (isCompetitionCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Competition already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
      notifications.show({
        title: `Competition created!`,
        message: `A new competition has been created.`,
        color: "green",
      });
    }
    form.setValues({
      name: "",
      tags: "",
      code: "",
      status: true,
      subject_id: "",
      parent_competition_id: "",
      mode_id: "",
      message: "",
    });
    close();
  };

  let subjectNames: any = [];

  subjects?.map((subject) => {
    if (subject.name && subject.status) {
      subjectNames.push(subject.name);
    }
  });

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
            <TextInput
              disabled={readonly || !!rowData}
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
              data={subjectNames}
              name="subject_id"
              withAsterisk
              label="Subject"
              {...form.getInputProps("subject_id")}
              w={"100%"}
              mt={"md"}
              size="md"
              onChange={async (event) => {
                form.setFieldValue("subject_id", event ?? "");
              }}
            />
            <TextInput
              disabled={readonly}
              withAsterisk
              label="Parent Competition"
              placeholder="Mathematics"
              {...form.getInputProps("parent_competition_id")}
              w={"100%"}
              mt={"md"}
              size="md"
              onChange={(event) => {
                form.setFieldValue("parent_competition_id", event.currentTarget.value);
              }}
            />
          </Flex>
          <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
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
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={["Online", "Offline", "Both"]}
              label={"Mode"}
              name="Mode"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("mode_id")}
              onChange={async (event) => {
                form.setFieldValue("mode_id", event ?? "");
              }}
              w={"100%"}
            />
            <TextInput
              disabled={readonly}
              label="Tags"
              placeholder="Tag1"
              {...form.getInputProps("tags")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
          </Flex>
        </Flex>
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <Editor
            readOnly={readonly}
            placeholder="Any additional notes regarding the competition should go here."
            label="Message"
            {...form.getInputProps("message")}
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

export { CompetitionForm };
