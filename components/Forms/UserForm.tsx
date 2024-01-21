import { TextInput, Checkbox, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createOtherUsers, readCities, readStates, updateDataRes } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { UserRoleFormMapping } from "@/utilities/users";
import { RoleMatrix } from "../permissions";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import { filterDataSingle } from "@/helpers/dropDownData";
import { checkValidDate } from "@/helpers/validations";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { DateinputCustom } from "../utils";

function UserForm({
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
  formType: any;
}) {
  const [citiesData, setCitiesData] = useState<MatrixDataType>([]);
  const [statesData, setStatesData] = useState<MatrixDataType>([]);
  const [showRoles, setshowRoles] = useState<any>(isExtra ? rowData?._id : false);
  const [isUpdate, setisUpdate] = useState<any>(rowData?._id);

  let isteachersForm = formType == "Teachers";

  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData("selectedCountry", "", true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
  };

  const getMobileCode = () => {
    return `+${getSelectedCountry()}`;
  };

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

  const form = useForm({
    initialValues: {
      ...rowData,
      mobile_1: rowData?.mobile_1?.replace(getMobileCode(), "").trim() ?? "",
      mobile_2: rowData?.mobile_2?.replace(getMobileCode(), "").trim() ?? "",
      dob: checkValidDate(rowData?.dob) || null,
      country: rowData?.country || getSelectedCountry() || "",
      role: UserRoleFormMapping[formType],
    },
    validate: {
      name: (value: any) => (value?.length < 2 || !value?.length ? "Name must have at least 2 letters" : null),
      // address: (value) => (value.length < 2 ? 'Address must have at least 50 letters' : null),
      // pincode: (value) => (/^[1-9][0-9]{5}$/.test(value) ? null : "Invalid pin-code"), // ^[1-9][0-9]{5}$ // ^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$
      email_1: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      // mobile_1: (value) => (/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) ? null : "Invalid mobile number"),
      // gender: (value: any) =>
      //   ["Female", "Male", "Other", "Prefer Not To Say"].includes(value) ? null : "Gender must be selected",
      // school_name: (value) => (value.length === 0 ? "School must be selected" : null),
      // section: (value) => (value.length === 0 ? "Section must be selected" : null),
      // class_code: (value) => (value?.length === 0 ? "Class must be selected" : null),
      // competition_code: (value) => (value?.length === 0 ? "Competition must be selected" : null),
      state: (value: any) => (!value?.length ? "State must be selected" : null),
      city: (value: any) => (!value?.length ? "City must be selected" : null),
      // exam_center_id: (value) => (value.length === 0 ? "Exam center must be selected" : null),
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
    };

    if (!!values.mobile_1) values.mobile_1 = getMobileCode() + values.mobile_1;
    if (!!values.mobile_2) values.mobile_2 = getMobileCode() + values.mobile_2;

    setOLoader(true);
    if (!!rowData) {
      updateDataRes("users", values, "_id", rowData._id, "update")
        .then(async (res) => {
          setOLoader(false);
          setshowRoles(rowData?.username);
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
      createOtherUsers(values as MatrixRowType)
        .then(async (res) => {
          setOLoader(false);
          setshowRoles(res.data.registration_number);
          if (res.data.response.toUpperCase() == "DOCUMENT CREATED") {
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
  };

  const onChangeStateName = async (event: string) => {
    form.setFieldValue("state", event);
    await readCitiesData("state", event);
  };

  const cityNames = filterDataSingle(citiesData || [], "name");
  const stateNames = filterDataSingle(statesData || [], "name");

  const saveJson = (json: any, updateData: any) => {
    let action = !!updateData?._id ? "update" : "create";
    let data = {
      name: showRoles,
      data: json,
      _id: updateData?._id,
    };
    updateDataRes("rolemappings", data, "", "", action)
      .then((res) => {
        notifications.show({
          title: `permissions updated successfully !`,
          message: ``,
        });
        setTimeout(() => {
          close();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: `There is an issue please try again after some time !`,
          message: ``,
          color: "red",
        });
        setTimeout(() => {
          close();
        }, 1000);
      });
  };

  const renderRoles = () => {
    return (
      <RoleMatrix
        filterID={showRoles || isUpdate}
        title={isUpdate ? "Update" : "Add"}
        onclick={(json: any, updateData: any) => {
          saveJson(json, updateData);
        }}
      />
    );
  };

  return (
    <Box maw={"100%"} mx="auto">
      {showRoles ? (
        renderRoles()
      ) : (
        <form onSubmit={form.onSubmit(onSubmitForm)}>
          <LoadingOverlay visible={oLoader} overlayBlur={2} />
          <Flex gap={"md"} direction={"row"} justify={"center"} align={"flex-start"} w={"100%"}>
            <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
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
                withAsterisk
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
                  // withAsterisk
                  name: "Date of Birth (DoB)",
                  label: "Date of Birth (DoB)",
                  ...form.getInputProps("dob"),
                  w: "100%",
                  mt: "md",
                  size: "md",
                }}
              />
              {isteachersForm && (
                <Select
                  clearable
                  disabled={readonly}
                  searchable
                  name="Designation"
                  nothingFound="No options"
                  mt={"md"}
                  size="md"
                  withAsterisk
                  {...form.getInputProps("designation")}
                  w={"100%"}
                  label="Designation"
                  placeholder="Select Designation"
                  data={[
                    { value: "teacher", label: "Teacher" },
                    { value: "principal", label: "Principal" },
                  ]}
                />
              )}
            </Flex>
            <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
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

              <Textarea
                disabled={readonly}
                placeholder="23, Horizon Lane, Spring Creek Avenue, Paris, France - 780004"
                label="Address"
                {...form.getInputProps("address")}
                // withAsterisk
                name="Address"
                autosize
                minRows={1}
                w={"100%"}
                mt={"md"}
                size="md"
              />
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
                {...form.getInputProps("state")}
                onChange={onChangeStateName}
                w={"100%"}
              />
              <Select
                clearable
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
            </Flex>
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
              {isUpdate && (
                <Button onClick={() => setshowRoles(isUpdate)} disabled={readonly} type={"button"}>
                  Change Role
                </Button>
              )}
            </Group>
          )}
        </form>
      )}
    </Box>
  );
}

export { UserForm };
