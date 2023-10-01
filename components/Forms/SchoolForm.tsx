import { TextInput, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay, Radio } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
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
import { getReduxState } from "@/redux/hooks";
import { getInternationalDailingCode } from "@/utilities/countriesUtils";
import { maxLength } from "@/helpers/validations";
import { filterDrodownData } from "@/helpers/filterFromJson";
import { filterDataSingle } from "@/helpers/dropDownData";

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
  rowData?: MatrixRowType;
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
  const [relationshipManager, setrelationshipManager] = useState<any>([]);

  const getSelectedCountry = () => {
    const state = getReduxState();
    return state.client.selectedCountry.name;
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
    if (rowData?.state) {
      readCitiesData("state", rowData?.state);
    }
  }, [rowData?.state]);

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
    let newDataFilter = filterDrodownData(newData, "name", "name");
    setgroupData(newDataFilter);
  }

  async function readData(designation: any, setData: any, role: any = "teacher") {
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
    let newData = filterDrodownData(teachers, "name", "name");
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
    readData("", setrelationshipManager, "rm");
  }, []);

  const getMobileCode = () => {
    return `+${getInternationalDailingCode(getSelectedCountry())}`;
  };

  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      board: rowData?.board ?? "",
      group: rowData?.group ?? "",
      type: rowData?.type ?? "",
      tags: rowData?.tags ?? "",
      country: rowData?.country ?? "",
      state: rowData?.state ?? "",
      city: rowData?.city ?? "",
      principal: rowData?.principal ?? "",
      address: rowData?.address ?? "",
      pincode: rowData?.pincode ?? "",
      label: rowData?.label ?? "",
      name_address: rowData?.name_address ?? "",
      name_certificate: rowData?.name_certificate ?? "",
      geo_address: rowData?.geo_address ?? "",
      contact_number: String(rowData?.contact_number)?.replace(getMobileCode(), "").trim() ?? "",
      contact_email: rowData?.contact_email ?? "",
      status: rowData?.status ?? "",
      relationship_manager: rowData?.relationship_manager ?? "",
      teacher_incharge: rowData?.teacher_incharge ?? "",
      sections: rowData?.sections ?? "",
      paid: rowData?.paid ?? "yes",
      affiliation: rowData?.affiliation ?? "no",
      language: rowData?.language ?? "",
      comments: rowData?.comments ?? "",
    },

    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      // principal: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      // teacher_incharge: (value) => (value.length < 2 ? "must have at least 2 letters" : null),
      // relationship_manager: (value) => (value.length < 2 ? "must have at least 2 letters" : null),
      // group: (value) => (value.length < 2 ? "must be selected" : null),
      // board: (value) => (value.length === 0 ? "Board must be selected" : null),
      state: (value) => (value.length === 0 ? "State must be selected" : null),
      city: (value) => (value.length === 0 ? "City must be selected" : null),
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
      if (isSchoolCreated.toLowerCase() === "document created") {
        const schools = await readSchools();
        setData(schools);
        setOLoader(false);
        notifications.show({
          title: `School created!`,
          message: `A new school has been created.`,
          color: "green",
        });
      } else if (isSchoolCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
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
    form.setValues({
      name: "",
      board: "",
      group: "",
      type: "",
      tags: "",

      country: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      label: "",
      geo_address: "",
    });
    close();
  };

  const onChangeState = async (event: any) => {
    form.setFieldValue("state", event || "");
    form.setFieldValue("city", "");
    await readCitiesData("state", event);
  };

  const cityNames = filterDataSingle(citiesData || [], "name");
  const boardNames = filterDataSingle(boardsData || [], "name");
  const stateNames = filterDataSingle(statesData || [], "name");

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px", width: "100%" }}>
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
            <TextInput
              disabled={readonly}
              name="Contact E-Mail"
              label="Contact E-Mail"
              placeholder="john.doe@ignitedmindlab.com"
              {...form.getInputProps("contact_email")}
              w={"100%"}
              mt={"md"}
              size="md"
            />
            <TextInput
              disabled={readonly}
              // withAsterisk
              name="Contact Number"
              label="Contact Number"
              placeholder="9876320145"
              {...form.getInputProps("contact_number")}
              type={"number"}
              w={"100%"}
              mt={"md"}
              size="md"
              icon={<div style={{ color: "black" }}>{getMobileCode()}</div>}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={boardNames}
              label={"Board"}
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("board")}
              w={"100%"}
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
              disabled={readonly}
              searchable
              placeholder="Group XYZ"
              nothingFound="No options"
              data={groupData}
              label={"Group"}
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("group")}
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
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={stateNames}
              label={"State"}
              name="State"
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("state")}
              onChange={onChangeState}
              w={"100%"}
            />
            <Select
              disabled={readonly || form.values.state === ""}
              searchable
              nothingFound="No options"
              data={cityNames}
              label={"City"}
              mt={"md"}
              size="md"
              withAsterisk
              {...form.getInputProps("city")}
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
              disabled={readonly}
              searchable
              placeholder="Relationship Manager"
              nothingFound="No options"
              data={relationshipManager}
              label={"Relationship Manager"}
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("relationship_manager")}
              w={"100%"}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={principal}
              label={"Principal"}
              placeholder="Principal"
              mt={"md"}
              size="md"
              // withAsterisk
              {...form.getInputProps("principal")}
              w={"100%"}
            />
            <Select
              disabled={readonly}
              searchable
              nothingFound="No options"
              data={teacher}
              label={"Teacher Incharge"}
              mt={"md"}
              placeholder="Teacher Incharge"
              size="md"
              // withAsterisk
              {...form.getInputProps("teacher_incharge")}
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
