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
  readCountries,
  readExamCenters,
  readSchools,
  readStates,
  updateDataRes,
} from "@/utilities/API";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { FormType } from "../Matrix/types";
import { UserRoleFormMapping } from "@/utilities/users";
import { getReduxState } from "@/redux/hooks";
import { getInternationalDailingCode } from "@/utilities/countriesUtils";
import { RoleMatrix } from "../permissions";
import { checkValidDate, maxLength, selectMinDate } from "@/helpers/validations";
import { useSelector } from "react-redux";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import { findFromJson } from "@/helpers/filterFromJson";
import { filterDataMulti, filterDataSingle } from "@/helpers/dropDownData";

function Studentsform({
  readonly,
  setData,
  close,
  rowData,
  setRowData,
  setFormTitle,
  formType,
  isExtra,
}: {
  isExtra?: any;
  open: () => void;
  close: () => void;
  setData: Dispatch<SetStateAction<MatrixDataType>>;
  rowData?: MatrixRowType;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
  formType: FormType;
}) {
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [schoolsData, setSchoolsData] = useState<MatrixDataType>([]);
  const [examCentersData, setExamCentersData] = useState<MatrixDataType>([]);
  const [comeptitionsData, setCompetitionsData] = useState<MatrixDataType>([]);
  const [classesData, setClassesData] = useState<MatrixDataType>([]);
  const [countriesData, setCountriesData] = useState<MatrixDataType>([]);
  const [groupsData, setGroupData] = useState<any>([]);
  const [cohortsData, setCohortsData] = useState<any>([]);
  const [showRoles, setshowRoles] = useState<any>(false);
  const [isUpdate, setisUpdate] = useState<any>(rowData?._id);

  let allReduxData: any = useSelector((state) => state);
  let globalCountry = allReduxData?.client?.selectedCountry?.name;

  async function readSchoolsData(filterBy?: "name" | "city", filterQuery?: string | number) {
    let schools: MatrixDataType;
    if (filterBy && filterQuery) {
      schools = await readSchools(filterBy, filterQuery);
    } else {
      schools = await readSchools();
    }

    setSchoolsData(schools);
  }

  const getSelectedCountry = () => {
    const state = getReduxState();
    return state.client.selectedCountry.name;
  };

  const getMobileCode = () => {
    return `+${getInternationalDailingCode(getSelectedCountry())}`;
  };

  const getCohorts = () => {
    if (formType == "Students") {
      readApiData("cohorts")
        .then((res) => {
          setCohortsData(filterDataSingle(res || [], "code"));
        })
        .catch((error) => console.error(error));
    }
  };

  const getGroups = () => {
    if (formType == "Students") {
      readApiData("groups")
        .then((res) => {
          setGroupData(filterDataSingle(res || [], "code"));
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    if (!showRoles) {
      getGroups();
      getCohorts();
    }
  }, []);

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
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

  // async function readCountriesData(filterBy?: "name" | "status", filterQuery?: string | number) {
  //   const countries = await readCountries("status", true);
  //   setCountriesData(countries);
  // }

  async function readExamCentersData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const examCenters = await readExamCenters();
    setExamCentersData(examCenters);
  }

  async function readCompetitionsData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const competitions = await readCompetitions();
    setCompetitionsData(competitions);
  }

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    const classes = await readClasses();
    setClassesData(classes);
  }

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
    if (!showRoles) {
      readStatesData();
    }
  }, [rowData?.country]);

  useEffect(() => {
    if (!showRoles) {
      readCitiesData();
    }
  }, [rowData?.state]);

  useEffect(() => {
    if (!showRoles) {
      readSchoolsData();
    }
  }, [rowData?.city]);

  useEffect(() => {
    if (!showRoles) {
      readClassesData();
      readCompetitionsData();
      // readCountriesData();
      readExamCentersData();
    }
  }, []);

  const form = useForm({
    initialValues: {
      competition_code: rowData?.competition_code,
      competition: rowData?.competition,
      class_code: rowData?.class_code,
      class_id: rowData?.class_id,
      section: rowData?.section ?? "",
      name: rowData?.name ?? "",
      mobile_1: rowData?.mobile_1?.replace(getMobileCode(), "").trim() ?? "",
      mobile_2: rowData?.mobile_2?.replace(getMobileCode(), "").trim() ?? "",
      email_1: rowData?.email_1 ?? "",
      email_2: rowData?.email_2 ?? "",
      dob: checkValidDate(rowData?.dob, null),
      gender: rowData?.gender ?? "",
      school_name: rowData?.school_name ?? "",
      exam_center_id: rowData?.exam_center_id ?? "",
      address: rowData?.address ?? "",
      country: rowData?.country || globalCountry,
      state: rowData?.state ?? "",
      city: rowData?.city ?? "",
      pincode: rowData?.pincode ?? "",
      role: UserRoleFormMapping[formType],
      consented: rowData?.consented ?? true,
      cohort_code: rowData?.cohort_code,
      group_code: rowData?.group_code,
      status: rowData?.status,
    },

    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      // address: (value) => (value.length < 2 ? 'Address must have at least 50 letters' : null),
      // pincode: (value) => (/^[1-9][0-9]{5}$/.test(value) ? null : "Invalid pin-code"), // ^[1-9][0-9]{5}$ // ^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$
      // email_1: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      // mobile_1: (value) => (/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ? null : "Invalid mobile number"),
      // gender: (value) =>
      //   ["Female", "Male", "Other", "Prefer Not To Say"].includes(value) ? null : "Gender must be selected",
      school_name: (value) => (value.length === 0 ? "School must be selected" : null),
      // section: (value) => (value.length === 0 ? "Section must be selected" : null),
      class_code: (value) => (!value ? "Class must be selected" : null),
      competition_code: (value) => (value?.length === 0 ? "Competition must be selected" : null),
      state: (value) => (value.length === 0 ? "State must be selected" : null),
      city: (value) => (value.length === 0 ? "City must be selected" : null),
      exam_center_id: (value) => (value.length === 0 ? "Exam center must be selected" : null),
      consented: (value) => (value === true || value === false ? null : "Communication consent must be set"),
    },
  });
  // email_2: (value) => (value.length > 0 ? /^\S+@\S+$/.test(value) ? null : 'Invalid alternate email' : 'Invalid alternate email'),
  // mobile_2: (value) => (value.length > 0 && /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ? null : "Invalid alternate mobile number"),
  const [oLoader, setOLoader] = useState<boolean>(false);

  const onSubmitForm = async (values: any) => {
    values = {
      ...values,
      role: UserRoleFormMapping[formType],
      dob: new Date(values.dob || Date()).toDateString(),
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
            const users = await formTypeToFetcherMapper(formType)();
            setData(users);
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
            const users = await formTypeToFetcherMapper(formType)();
            setData(users);
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
    form.setFieldValue("city", event);
    await readSchoolsData("city", event);
  };

  const onChangeStateName = async (event: string) => {
    form.setFieldValue("state", event);
    await readCitiesData("state", event);
  };

  const onChangeExamCenter = async (event: string) => {
    form.setFieldValue("exam_center_id", event);
  };

  const onChangeClass = async (event: string) => {
    let filterdData = findFromJson(classesData, event, "code");
    form.setFieldValue("class_id", filterdData.name);
    form.setFieldValue("class_code", event);
  };

  const onChangeCompetition = async (event: string) => {
    let filterdData = findFromJson(comeptitionsData, event, "code");
    form.setFieldValue("competition", filterdData.name);
    form.setFieldValue("competition_code", event);
  };

  const schoolNames = filterDataSingle(schoolsData || [], "name");
  const cityNames = filterDataSingle(citiesData || [], "name");
  const stateNames = filterDataSingle(statesData || [], "name");
  const examCentersNames = filterDataMulti(examCentersData, "name", "_id", "ID:", "_id");
  const competitionsNames = filterDataMulti(comeptitionsData, "name", "code");
  const classesNames = filterDataMulti(classesData, "name", "code", "", "", false);

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onSubmitForm)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px", width: "100%" }}>
            <TextInput
              disabled={readonly || !!rowData}
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
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={competitionsNames}
              label={"Competition"}
              name="Competition"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("competition_code")}
              onChange={onChangeCompetition}
              w={"100%"}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={classesNames}
              label={"Class"}
              name="Class"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("class_code")}
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
                {...form.getInputProps("cohort_code")}
                onChange={(value) => {
                  form.setFieldValue("cohort_code", value ?? "");
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
            <DateInput
              popoverProps={{
                withinPortal: true,
              }}
              disabled={readonly}
              // withAsterisk
              valueFormat="ddd MMM DD YYYY"
              name="Date of Birth (DoB)"
              label="Date of Birth (DoB)"
              placeholder={`${new Date(Date.now()).toDateString()}`}
              {...form.getInputProps("dob")}
              w={"100%"}
              mt={"md"}
              size="md"
              maxDate={selectMinDate(0)}
            />

            <Select
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
              disabled={readonly}
              searchable
              name="School"
              nothingFound="No options"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("school_name")}
              onChange={(event) => {
                form.setFieldValue("school_name", event ?? "");
              }}
              w={"100%"}
              label="School"
              data={schoolNames}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={examCentersNames}
              label={"Exam Center"}
              name="Exam Center"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("exam_center_id")}
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
              disabled={readonly || form.values.country === ""}
              searchable
              nothingFound="No options"
              data={stateNames}
              label={"State"}
              name="State"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("state")}
              onChange={onChangeStateName}
              w={"100%"}
            />
            <Select
              disabled={readonly || form.values.state === ""}
              searchable
              nothingFound="No options"
              data={cityNames}
              name="City"
              label={"City"}
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("city")}
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
