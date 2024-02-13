import { TextInput, Button, Group, Box, Flex, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createExamCenterMapping,
  readClasses,
  readCompetitions,
  readExamCenters,
  readExamCentersMapping,
  readSchools,
  updateExamCenterMapping,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { filterData } from "@/helpers/filterData";

function ExamCenterMappingForm({
  readonly,
  examCenterCode,
  setData,
  open,
  close,
  rowData,
  setRowData,
  setFormTitle,
}: {
  examCenterCode: string;
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: any;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [examCentersData, setExamCentersData] = useState<string[]>([]);
  const [comeptitionsData, setCompetitionsData] = useState<string[]>([]);
  const [classesData, setClassesData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<{
    countries: MatrixDataType;
    states: MatrixDataType;
    cities: MatrixDataType;
    schools: MatrixDataType;
    examCenters: MatrixDataType;
    competitions: MatrixDataType;
    classes: MatrixDataType;
  }>({
    countries: [],
    states: [],
    cities: [],
    schools: [],
    examCenters: [],
    competitions: [],
    classes: [],
  });
  async function readSchoolsData(filterBy?: "name" | "city", filterQuery?: string | number) {
    let schools: MatrixDataType;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }
    setRawData((previousData) => {
      return {
        ...previousData,
        schools: schools,
      };
    });
  }

  async function readExamCentersData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const examCenters = await readExamCenters();
    setRawData((previousData) => {
      return {
        ...previousData,
        examCenters: examCenters,
      };
    });

    const examCentersNames = filterData(examCenters, "label", "value", "_id");

    setExamCentersData(examCentersNames);
  }
  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const competitions = await readCompetitions();
    setRawData((previousData) => {
      return {
        ...previousData,
        competitions: competitions,
      };
    });
    const competitionsNames = filterData(competitions, "label", "value", "_id");
    setCompetitionsData(competitionsNames);
  }
  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const classes = await readClasses();
    setRawData((previousData) => {
      return {
        ...previousData,
        classes: classes,
      };
    });
    const classesNames = filterData(classes, "label", "value", "_id", true, "order_code", undefined, true);
    setClassesData(classesNames);
  }
  useEffect(() => {
    readSchoolsData();
    readExamCentersData();
    readCompetitionsData();
    readClassesData();
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name} ${rowData.code}`);
      else setFormTitle(`Update ${rowData.exam_center_id} ${rowData?.code || ""}`);
    } else {
      setFormTitle(`Add exam center mapping`);
    }
  }, []);

  const form = useForm({
    initialValues: { ...rowData },
    validate: {},
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  return (
    <Box maw={"100%"} mx="auto">
      <form
        onSubmit={form.onSubmit(async (values) => {
          setOLoader(true);
          if (rowData !== undefined) {
            const formValues = {
              ...values,
            };
            const isExamCenterMappingUpdated = await updateExamCenterMapping(rowData._id, formValues);
            if (isExamCenterMappingUpdated.toUpperCase() === "DOCUMENT UPDATED") {
              const examCenterMapping = await readExamCentersMapping();
              setData(examCenterMapping);
              setOLoader(false);
            } else {
              setOLoader(false);
            }
            setRowData(undefined);
            notifications.show({
              title: `Exam Center Mapping ${rowData.exam_center_id} updated!`,
              message: `The above exam center mapping has been updated with new information.`,
              color: "blue",
            });
          } else {
            const formValues = values;

            const isExamCenterMappingCreated = await createExamCenterMapping(formValues as MatrixRowType);
            if (isExamCenterMappingCreated.toUpperCase() === "DOCUMENT CREATED") {
              const examCenterMapping = await readExamCentersMapping();
              setData(examCenterMapping);
              setOLoader(false);
            } else if (isExamCenterMappingCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
              setOLoader(false);
              notifications.show({
                title: `Exam Center Mapping already exists!`,
                message: `Exam Center Mapping already exists.`,
                color: "orange",
              });
            } else {
              setOLoader(false);
            }
            notifications.show({
              title: `Exam Center Mapping created!`,
              message: `A new exam center mapping has been created.`,
              color: "green",
            });
          }
          form.setValues({
            registration_number: "",
            status: true,
            seat_number: "",
            exam_center_id: "",
            competition_id: "",
            class_id: "",
          });
          close();
        })}
      >
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Registration Number"
            placeholder="123456789"
            {...form.getInputProps("registration_number")}
            w={"100%"}
            mt={"md"}
            size="md"
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={examCentersData}
            label={"Exam Center"}
            name="Exam Center"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("exam_center_id")}
            onChange={async (event) => {
              const iExamCenter = rawData.examCenters.find((i) => i._id === event);
              // setExamCenterID(iExamCenter?._id || "");
              form.setFieldValue("exam_center_id", event || "");
            }}
            w={"100%"}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={comeptitionsData}
            label={"Competition"}
            name="Competition"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("competition_id")}
            onChange={async (event) => {
              // const iComp = rawData.competitions.find((i) => i.code === event);
              // setCompetitionCode(iComp?.code || "");
              form.setFieldValue("competition_id", event || "");
            }}
            w={"100%"}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={classesData}
            label={"Class"}
            name="Class"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("class_id")}
            onChange={async (event) => {
              // const iClass = rawData.classes.find((i) => i.code === event);
              // setClassCode(iClass?.code || "");
              // setClassID(iClass?._id || "");
              form.setFieldValue("class_id", event || "");
            }}
            w={"100%"}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type={"submit"}>
            {rowData !== undefined ? "Update" : "Add"}
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export { ExamCenterMappingForm };
