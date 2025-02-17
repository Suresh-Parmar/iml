import { TextInput, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay, Radio, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createExamCenter,
  createSchool,
  readApiData,
  readBoards,
  readCities,
  readSchools,
  readStates,
  readTeachers,
  updateSchool,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { checkValidEmailOrNot, maxLength } from "@/helpers/validations";
import { filterDrodownData, findFromJson } from "@/helpers/filterFromJson";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { DateinputCustom } from "../utils";
import { dateInputHandler } from "@/helpers/dateHelpers";
import { filterData } from "@/helpers/filterData";

function SchoolForm({
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
  rowData?: any;
  setRowData: Dispatch<SetStateAction<MatrixRowType | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [boardsData, setBoardsData] = useState<MatrixDataType>([]);
  const [groupData, setgroupData] = useState<any>([]);
  const [teacher, setTeacher] = useState<any>([]);
  const [principal, setPrincipal] = useState<any>([]);
  const [EmailError, setEmailError] = useState<any>("");
  const [relationshipManager, setrelationshipManager] = useState<any>([]);

  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData("selectedCountry", "", true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.label || selectedCountryLocal?.label || "";
  };

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add school`);
    }
  }, []);

  useEffect(() => {
    if (rowData?.state_id) {
      let stateName = findFromJson(stateNames, rowData?.state_id, "_id");
      readCitiesData("state", stateName.name);
    }
  }, [rowData?.state_id]);

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: MatrixDataType;
    if (filterBy && filterQuery) {
      cities = await readCities(filterBy, filterQuery);
    } else {
      cities = await readCities();
    }
    setCitiesData(cities);
  }

  async function readBoardsData(filterBy?: "name", filterQuery?: string | number) {
    let boards: MatrixDataType;
    if (filterBy && filterQuery) {
      boards = await readBoards();
    } else {
      boards = await readBoards();
    }
    setBoardsData(boards);
  }

  async function readDataGroups() {
    const newData = await readApiData("groups");
    let newDataFilter = filterData(newData, "label", "value", "code");
    setgroupData(newDataFilter);
  }

  const setDatesExtra = (e: any, keyArr: any[]) => {
    keyArr.map((key: any) => {
      let values: any = { ...form.values };
      if (dateInputHandler(e) > dateInputHandler(values[key])) {
        form.setFieldValue(key, e);
      }
    });
  };

  async function readData(designation: any, setData: any, role: any = "teacher", setKey: any = "name") {
    let filterData: any = {
      collection_name: "users",
      op_name: "find_many",
      filter_var: {
        role: role,
        country: getSelectedCountry(),
      },
    };

    if (designation) {
      filterData.filter_var.designation = designation;
    }

    const teachers = await readTeachers(filterData);
    let newData = filterDrodownData(teachers, "name", "name", setKey);
    setData && setData(newData);
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

  useEffect(() => {
    readStatesData();
    readBoardsData();
    readDataGroups();
    readData("teacher", setTeacher);
    readData("principal", setPrincipal);
    readData("", setrelationshipManager, "rm", "_id");
  }, []);

  const getMobileCode = () => {
    return "+" + reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  let affiliationShow: any = {
    y: "yes",
    n: "no",
    Y: "yes",
    N: "no",
  };

  let affiliationVal = affiliationShow[rowData?.affiliation];
  if (!affiliationVal) {
    affiliationVal = rowData?.affiliation || "no";
  }

  const form: any = useForm({
    initialValues: {
      ...rowData,
      create_exam_center: false,
      affiliation: affiliationVal,
      contact_number: rowData?.contact_number
        ? String(rowData?.contact_number)?.replace(getMobileCode(), "").trim()
        : "",
    },

    validate: {
      name: (value: any) => (!value || value?.length < 2 ? "Name must have at least 2 letters" : null),
      // principal: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      // teacher_incharge: (value) => (value.length < 2 ? "must have at least 2 letters" : null),
      // relationship_manager: (value) => (value.length < 2 ? "must have at least 2 letters" : null),
      // group: (value) => (value.length < 2 ? "must be selected" : null),
      // board: (value) => (value.length === 0 ? "Board must be selected" : null),
      state_id: (value: any) => (!value?.length ? "State must be selected" : null),
      city_id: (value: any) => (!value?.length ? "City must be selected" : null),
      // address: (value) => (value.length < 2 ? "Address must have at least 50 letters" : null),
      // name_address: (value) => (value.length < 2 ? "Address must have at least 50 letters" : null),
      // label: (value) => (value.length < 2 ? "Address must have at least 50 letters" : null),
      // pincode: (value) => (/^[1-9][0-9]{5}$/.test(value) ? null : "Invalid pin-code"), // ^[1-9][0-9]{5}$ // ^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$
      // contact_number: (value) =>
      //   /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ? null : "Invalid mobile number",
      // contact_email: isEmail("Invalid email"),
    },
  });
  const [oLoader, setOLoader] = useState<boolean>(false);

  console.log(form.values, "formvalues");

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      values = {
        ...values,
      };
      const isSchoolUpdated = await updateSchool(rowData._id, values);
      if (isSchoolUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const schools = await readSchools();
        setData(schools);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `School ${rowData.name} updated!`,
        message: `The above school has been updated with new information.`,
        color: "blue",
      });
    } else {
      values = {
        ...values,
        contact_number: `${getMobileCode()}${values.contact_number}`,
        country: getSelectedCountry(),
      };
      const isSchoolCreated = await createSchool(values as MatrixRowType);
      if (isSchoolCreated?.toLowerCase() === "document created") {
        if (form?.values?.create_exam_center) {
          await addExamCenters(values);
        }
        const schools = await readSchools();
        setData(schools);
        setOLoader(false);
        notifications.show({
          title: `School created!`,
          message: `A new school has been created.`,
          color: "green",
        });
      } else if (isSchoolCreated?.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `School already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }

    close();
  };

  const addExamCenters = async (values: any) => {
    const genratedPayload: any = {
      address: values.address,
      examdate: values.exam_date,
      mode: values.exam_mode,
      name: values.name,
      state_id: values.state_id,
      city_id: values.city_id,
    };

    const isExamCenterCreated = await createExamCenter(genratedPayload);
  };

  const onChangeState = async (event: any) => {
    form.setFieldValue("state_id", event || "");
    form.setFieldValue("city_id", "");
    let stateName = findFromJson(stateNames, event, "_id");

    await readCitiesData("state", stateName.name);
  };

  const cityNames = filterData(citiesData, "label", "value", "_id");
  const boardNames = filterData(boardsData, "label", "value", "code");
  const stateNames = filterData(statesData, "label", "value", "_id");

  const renderExtraFields = () => {
    if (form?.values?.create_exam_center) {
      return (
        <>
          <DateinputCustom
            inputProps={{
              popoverProps: {
                withinPortal: true,
              },
              disabled: readonly,
              name: "exam_date",
              label: "exam date",
              // placeholder: `${new Date(Date.now()).toDateString()}`,
              ...form.getInputProps("exam_date"),
              minDate: new Date(),
              onChange: (e: any) => {
                form.setFieldValue("exam_date", e);
                setDatesExtra(e, ["result_date"]);
              },
              w: "100%",
              mt: "md",
              size: "md",
            }}
          />
          <DateinputCustom
            inputProps={{
              popoverProps: {
                withinPortal: true,
              },
              minDate: dateInputHandler(form.values.exam_date),
              disabled: readonly,
              name: "result_date",
              label: "Result Date",
              // placeholder: `${new Date(Date.now()).toDateString()}`,
              ...form.getInputProps("result_date"),
              w: "100%",
              mt: "md",
              size: "md",
            }}
          />

          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={["online", "offline", "both"]}
            label={"Exam Mode"}
            mt={"md"}
            size="md"
            {...form.getInputProps("exam_mode")}
            w={"100%"}
          />
        </>
      );
    }
    return <></>;
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px", width: "100%" }}>
            <TextInput
              disabled={readonly}
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
            <div>
              <TextInput
                disabled={readonly}
                name="Contact E-Mail"
                label="Contact E-Mail"
                placeholder="john.doe@ignitedmindlab.com"
                {...form.getInputProps("contact_email")}
                w={"100%"}
                onChange={(evt) => {
                  let val = evt.target.value;
                  val = val.replaceAll(" ", "");
                  form.setFieldValue("contact_email", val);
                  if (EmailError) {
                    setEmailError("");
                  }
                }}
                onBlur={(e) => {
                  let mail = e.target.value;
                  let validMail = checkValidEmailOrNot(mail);
                  if (!validMail) {
                    form.setFieldValue("contact_email", "");
                    setEmailError("Invalid email Address");
                  }
                }}
                mt={"md"}
                size="md"
              />
              {EmailError && <div className="font12 text-danger">{EmailError}</div>}
            </div>
            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Contact Number"
              label="Contact Number"
              placeholder="9876320145"
              {...form.getInputProps("contact_number")}
              w={"100%"}
              mt={"md"}
              size="md"
              // icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={boardNames}
              label={"Board"}
              mt={"md"}
              size="md"
              // withAsterisk
              w={"100%"}
              value={Array.isArray(form.values.board_id) ? form.values.board_id[0] : form.values.board_id}
              onChange={(val: any) => {
                form.setFieldValue("board_id", [val]);
              }}
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              label="Class Label"
              placeholder="Class Label"
              {...form.getInputProps("label")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              placeholder="Group XYZ"
              nothingFound="No options"
              data={groupData}
              label={"Group"}
              mt={"md"}
              size="md"
              // withAsterisk
              value={Array.isArray(form.values.group_id) ? form.values.group_id[0] : form.values.group_id}
              onChange={(val: any) => {
                form.setFieldValue("group_id", [val]);
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
            <TextInput
              disabled={readonly}
              label="Section"
              placeholder="Section A"
              {...form.getInputProps("sections")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <Textarea
                disabled={readonly}
                placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
                label="Name Address"
                {...form.getInputProps("name_address")}
                // withAsterisk
                autosize
                // minRows={3}
                w={"100%"}
                onChange={(e) => {
                  let val = maxLength(e.target.value, 100);
                  form.setFieldValue("name_address", val);
                }}
                mt={"md"}
                size="md"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Textarea
                disabled={readonly}
                placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
                label="Address"
                {...form.getInputProps("address")}
                // withAsterisk
                autosize
                // minRows={3}
                w={"100%"}
                mt={"md"}
                onChange={(e) => {
                  let val = maxLength(e.target.value, 100);
                  form.setFieldValue("address", val);
                }}
                size="md"
              />
            </div>
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={stateNames}
              label={"State"}
              name="State"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("state_id")}
              onChange={onChangeState}
              w={"100%"}
            />
            <Select
              clearable
              disabled={readonly || form.values.state_id === ""}
              searchable
              nothingFound="No options"
              data={cityNames}
              label={"City"}
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("city_id")}
              w={"100%"}
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              label="Pin-Code"
              placeholder="780004"
              {...form.getInputProps("pincode")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <TextInput
              disabled={readonly}
              label="Name On Certificate"
              placeholder="Name On Certificate"
              {...form.getInputProps("name_certificate")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              placeholder="Relationship Manager"
              nothingFound="No options"
              data={relationshipManager}
              label={"Relationship Manager"}
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("rm_id")}
              w={"100%"}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={principal}
              label={"Principal"}
              placeholder="Principal"
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("principal_id")}
              w={"100%"}
            />
            <Select
              clearable
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={teacher}
              label={"Teacher Incharge"}
              mt={"md"}
              placeholder="Teacher Incharge"
              size="md"
              // withAsterisk
              {...form.getInputProps("teacher_incharge_id")}
              w={"100%"}
            />
            <TextInput
              disabled={readonly}
              label="Language"
              placeholder="hindi"
              {...form.getInputProps("language")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <Radio.Group {...form.getInputProps("affiliation")} withAsterisk label="Affiliation">
              <Group mt="xs">
                <Radio value="yes" label="Yes" />
                <Radio value="no" label="No" />
              </Group>
            </Radio.Group>
            <Radio.Group {...form.getInputProps("paid")} label="Paid">
              <Group mt="xs">
                <Radio value="yes" label="Yes" />
                <Radio value="no" label="No" />
              </Group>
            </Radio.Group>
            <Checkbox
              className="mt-3"
              style={{ gridColumn: "1 / -1" }}
              label="Create Exam Center"
              checked={form?.values?.create_exam_center}
              onChange={(event) => {
                form.setFieldValue("create_exam_center", event.currentTarget.checked);
                form.setFieldValue("exam_date", "");
                form.setFieldValue("exam_mode", "");
              }}
            />
            {renderExtraFields()}
            <div style={{ gridColumn: "1 / -1" }}>
              <Textarea
                disabled={readonly}
                placeholder="comments"
                label="Comments"
                {...form.getInputProps("comments")}
                autosize
                // minRows={3}
                w={"100%"}
                mt={"md"}
                size="md"
              />
            </div>
          </div>
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

export { SchoolForm };
