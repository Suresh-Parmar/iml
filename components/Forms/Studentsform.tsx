import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Flex,
  Textarea,
  Select,
  LoadingOverlay,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createStudent,
  readApiData,
  readCities,
  readClasses,
  readCompetitions,
  readExamCenters,
  readSchools,
  readStates,
  updateDataRes,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { FormType } from "../Matrix/types";
import { UserRoleFormMapping } from "@/utilities/users";
import { maxLength, selectMinDate } from "@/helpers/validations";
import { useSelector } from "react-redux";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import { findFromJson } from "@/helpers/filterFromJson";
import { filterDataMulti, filterDataSingle } from "@/helpers/dropDownData";
import { setGetData } from "@/helpers/getLocalStorage";
import { DateinputCustom } from "../utils";
import { filterData } from "@/helpers/filterData";

function Studentsform({
  readonly,
  setData,
  close,
  rowData,
  setRowData,
  setFormTitle,
  formType,
  isExtra,
  apiCall,
}: {
  isExtra?: any;
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: any;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
  formType: FormType;
  apiCall?: any;
}) {
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [schoolsData, setSchoolsData] = useState<MatrixDataType>([]);
  const [examCentersData, setExamCentersData] = useState<MatrixDataType>([]);
  const [comeptitionsData, setCompetitionsData] = useState<MatrixDataType>([]);
  const [classesData, setClassesData] = useState<MatrixDataType>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [cohortsData, setCohortsData] = useState<any>([]);

  let allReduxData: any = useSelector((state) => state);
  let globalCountry = allReduxData?.client?.selectedCountry?.name;

  useEffect(() => {
    if (rowData) {
      let title = rowData.name;
      if (rowData?.seat_number) {
        title += ` (${rowData.seat_number})`;
      }

      if (readonly) {
        title = "view " + title;
      } else {
        title = "Update " + title;
      }
      setFormTitle(title);
    } else {
      setFormTitle(`Add ${formType}`);
    }
  }, []);

  useEffect(() => {
    getGroups();
    getCohorts();
    readStatesData();
  }, [rowData?.country]);

  useEffect(() => {
    readCitiesData();
  }, [rowData?.state_id]);

  useEffect(() => {
    readSchoolsData();
  }, [rowData?.city]);

  useEffect(() => {
    readClassesData();
    readCompetitionsData();
    readExamCentersData();
  }, []);

  async function readSchoolsData(filterBy?: "name" | "city", filterQuery?: string | number) {
    let schools: MatrixDataType;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }

    setSchoolsData(schools);
  }

  let selectedCountryLocal = setGetData("selectedCountry", "", true);
  const getSelectedCountry = () => {
    return allReduxData?.data?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

  const getCohorts = () => {
    if (formType == "Students") {
      readApiData("cohorts")
        .then((res) => {
          setCohortsData(filterData(res, "label", "value", "code"));
        })
        .catch((error) => console.error(error));
    }
  };

  const getGroups = () => {
    if (formType == "Students") {
      readApiData("groups")
        .then((res) => {
          setGroupData(filterData(res, "label", "value", "code"));
        })
        .catch((error) => console.error(error));
    }
  };

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    // let stateObj = findFromJson(stateNames, form.values.state_id, "_id");

    let cities: MatrixDataType;
    if (filterBy && filterQuery) {
      cities = await readCities(filterBy, filterQuery);
    } else {
      cities = await readCities();
    }
    setCitiesData(cities);
  }

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states: MatrixDataType;
    if (filterBy && filterQuery) {
      states = await readStates(filterBy, filterQuery);
    } else {
      states = await readStates();
    }
    setStatesData(states);
  }

  async function readExamCentersData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const examCenters = await readExamCenters();
    setExamCentersData(examCenters);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const competitions = await readCompetitions();
    setCompetitionsData(competitions);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes = await readClasses();
    classes = filterData(classes, "label", "value", "_id", true, "order_code", undefined, true);

    setClassesData(classes);
  }

  const form = useForm({
    initialValues: {
      ...rowData,
      role: UserRoleFormMapping[formType],
      country: rowData?.country || globalCountry,
      consented: rowData?.consented ?? true,
      mobile_1: rowData?.mobile_1?.replace(getMobileCode(), "").trim() ?? "",
      mobile_2: rowData?.mobile_2?.replace(getMobileCode(), "").trim() ?? "",
    },

    validate: {
      name: (value: any) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      school_id: (value: any) => (value?.length === 0 ? "School must be selected" : null),
      class_code: (value: any) => (!value ? "Class must be selected" : null),
      competition_code: (value: any) => (value?.length === 0 ? "Competition must be selected" : null),
      state_id: (value: any) => (value?.length === 0 ? "State must be selected" : null),
      city_id: (value: any) => (value?.length === 0 ? "City must be selected" : null),
      exam_id: (value: any) => (value?.length === 0 ? "Exam center must be selected" : null),
      consented: (value: any) => (value === true || value === false ? null : "Communication consent must be set"),
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);

  const onSubmitForm = async (values: any) => {
    values = {
      ...values,
      role: UserRoleFormMapping[formType],
    };

    if (!!values.mobile_1) values.mobile_1 = getMobileCode() + values.mobile_1;
    if (!!values.mobile_2) values.mobile_2 = getMobileCode() + values.mobile_2;

    setOLoader(true);
    if (!!rowData) {
      updateDataRes("users", values, "_id", rowData._id, "update")
        .then(async (res) => {
          setOLoader(false);
          // setshowRoles(rowData?.username);
          if (res.data.response.toUpperCase() === "DOCUMENT UPDATED") {
            if (!apiCall) {
              const users = await formTypeToFetcherMapper(formType)();
              setData(users);
            }
          }
          setRowData(undefined);
          notifications.show({
            title: `User ${rowData.name} updated!`,
            message: `The above user has been updated with new information.`,
            color: "blue",
          });
        })
        .catch((error) => {
          setOLoader(false);
          notifications.show({
            title: `There is an issue please try again after some time !`,
            message: ``,
            color: "red",
          });
        });
    } else {
      if (!!values.mobile_1) values.password = values.mobile_1?.replace(getMobileCode(), "");
      createStudent(values as MatrixRowType)
        .then(async (res) => {
          // setshowRoles(res.data.registration_number);
          if (res.data.response.toUpperCase() == "DOCUMENT CREATED") {
            setOLoader(false);
            if (!apiCall) {
              const users = await formTypeToFetcherMapper(formType)();
              setData(users);
            }
            notifications.show({
              title: `User created!`,
              message: `${res.data.registration_number || ""} has been created.`,
              color: "green",
            });
          } else if (res.data.response.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
            notifications.show({
              title: `User already exists!`,
              message: `${values.name} already exists.`,
              color: "orange",
            });
          }
        })
        .catch((error) => {
          console.log(error, "errorError");
          setOLoader(false);
          notifications.show({
            title: `There is an issue please try again after some time !`,
            message: ``,
            color: "red",
          });
        });
    }
    close();
  };

  const onChangeCityName = async (event: string) => {
    let cityObject = findFromJson(citiesData, event, "_id");

    form.setFieldValue("city_id", event);
    await readSchoolsData("city", cityObject.name);
  };

  const onChangeStateName = async (event: string) => {
    form.setFieldValue("state_id", event);
    let stateObj = findFromJson(stateNames, event, "_id");
    await readCitiesData("state", stateObj.name);
  };

  const onChangeExamCenter = async (event: string) => {
    const examCenterData = findFromJson(examCentersNames, event, "_id");

    form.setFieldValue("exam_center_code", examCenterData.exam_center_id);
    form.setFieldValue("exam_id", event);
  };

  const onChangeClass = async (event: string) => {
    let filterdData = findFromJson(classesData, event, "_id");
    form.setFieldValue("class_id", event);
    form.setFieldValue("class_code", filterdData.code);
  };

  const onChangeCompetition = async (event: string) => {
    let filterdData = findFromJson(comeptitionsData, event, "_id");
    form.setFieldValue("competition_id", event);
    form.setFieldValue("competition_code", filterdData.code);
  };

  const schoolNames = filterData(schoolsData, "label", "value", "_id");
  const cityNames = filterData(citiesData, "label", "value", "_id");
  const stateNames = filterData(statesData, "label", "value", "_id");
  let examCentersNames = filterDataMulti(examCentersData, "name", "exam_id", "ID:", "exam_id");
  examCentersNames = filterData(examCentersData, "label", "value", "_id");
  let competitionsNames = filterData(comeptitionsData, "label", "value", "_id");
  const classesNames = filterData(classesData, "label", "value", "_id", true, "order_code", undefined, true);

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onSubmitForm)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px", width: "100%" }}>
            <TextInput
              disabled={readonly}
              withAsterisk
              label="Name"
              name="Name"
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
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={competitionsNames}
              label={"Competition"}
              name="Competition"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("competition_id")}
              onChange={onChangeCompetition}
              w={"100%"}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={classesNames}
              label={"Class"}
              name="Class"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("class_id")}
              onChange={onChangeClass}
              w={"100%"}
            />
            <TextInput
              disabled={readonly}
              name="Section"
              label="Section"
              placeholder="Example: A"
              mt={"md"}
              size="md"
              {...form.getInputProps("section")}
              w={"100%"}
            />

            <>
              <MultiSelect
                disabled={readonly}
                searchable
                nothingFound="No options"
                data={groupsData}
                label={"Groups"}
                name="groups"
                mt={"md"}
                size="md"
                {...form.getInputProps("group_code")}
                onChange={(value) => {
                  form.setFieldValue("group_code", value ?? "");
                }}
                w={"100%"}
              />
              <MultiSelect
                disabled={readonly}
                searchable
                nothingFound="No options"
                data={cohortsData}
                label={"Cohorts"}
                name="cohorts"
                mt={"md"}
                size="md"
                {...form.getInputProps("cohort")}
                onChange={(value) => {
                  form.setFieldValue("cohort", value ?? "");
                }}
                w={"100%"}
              />
            </>

            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Mobile (Primary)"
              label="Mobile (Primary)"
              placeholder="+919876320145"
              {...form.getInputProps("mobile_1")}
              w={"100%"}
              mt={"md"}
              size="md"
              icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Mobile (Secondary)"
              label="Mobile (Secondary)"
              placeholder="+919876320154"
              {...form.getInputProps("mobile_2")}
              icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Email (Primary)"
              label="Email (Primary)"
              placeholder="john.doe@ignitedmindlab.com"
              {...form.getInputProps("email_1")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Email (Secondary)"
              label="Email (Secondary)"
              placeholder="john.doe@ignitedmindlab.com"
              {...form.getInputProps("email_2")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <DateinputCustom
              inputProps={{
                popoverProps: {
                  withinPortal: true,
                },
                disabled: readonly,
                name: "Date of Birth (DoB)",
                label: "Date of Birth (DoB)",
                // placeholder: `${new Date(Date.now()).toDateString()}`,
                ...form.getInputProps("dob"),
                w: "100%",
                mt: "md",
                size: "md",
                maxDate: selectMinDate(0),
              }}
            />

            <Select
              clearable
              disabled={readonly}
              searchable
              name="Gender"
              nothingFound="No options"
              mt={"md"}
              size="md"
              {...form.getInputProps("gender")}
              w={"100%"}
              label="Gender"
              placeholder="Select your gender"
              data={["Female", "Male", "Other", "Prefer Not To Say"]}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              name="School"
              nothingFound="No options"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("school_id")}
              onChange={(event) => {
                form.setFieldValue("school_id", event ?? "");
              }}
              w={"100%"}
              label="School"
              data={schoolNames}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={examCentersNames}
              label={"Exam Center"}
              name="Exam Center"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("exam_id")}
              onChange={onChangeExamCenter}
              w={"100%"}
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <Textarea
                disabled={readonly}
                placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
                label="Address"
                {...form.getInputProps("address")}
                // withAsterisk
                name="Address"
                autosize
                onChange={(e) => {
                  let val = maxLength(e.target.value, 100);
                  form.setFieldValue("address", val);
                }}
                // minRows={4}
                w={"100%"}
                mt={"md"}
                size="md"
              />
            </div>

            <Select
              clearable
              disabled={readonly || form.values.country === ""}
              searchable
              nothingFound="No options"
              data={stateNames}
              label={"State"}
              name="State"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("state_id")}
              onChange={onChangeStateName}
              w={"100%"}
            />
            <Select
              clearable
              disabled={readonly || form.values.state_id === ""}
              searchable
              nothingFound="No options"
              data={cityNames}
              name="City"
              label={"City"}
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("city_id")}
              onChange={onChangeCityName}
              w={"100%"}
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              label="Pin-Code"
              name="Pin-Code"
              placeholder="780004"
              {...form.getInputProps("pincode")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
          </div>
        </Flex>

        {!readonly && (
          <Checkbox
            disabled={readonly}
            mt="md"
            label="I provide consent to Ignited Mind Lab to communicate with me via WhatsApp, SMS, E-Mail and Phone."
            {...form.getInputProps("consented", { type: "checkbox" })}
          />
        )}
        {!readonly && (
          <Group position="right" mt="md">
            <Button disabled={readonly} type={"submit"}>
              {rowData ? "Update" : "Add"}
            </Button>
          </Group>
        )}
      </form>
    </Box>
  );
}

export { Studentsform };
