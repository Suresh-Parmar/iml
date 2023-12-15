import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readApiData, readCities, readStates } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { filterData } from "@/helpers/filterData";
import { useSelector } from "react-redux";
import { calculatePhoneLen, emailFormat, validatePhone } from "@/helpers/validations";

function WarehouseForm({
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
  setRowData: Dispatch<SetStateAction<any | undefined>>;
  setFormTitle: Dispatch<SetStateAction<string>>;
  readonly?: boolean;
}) {
  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add Warehouse`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      pickup_addressline1: rowData?.pickup_addressline1 ?? "",
      pickup_addressline2: rowData?.pickup_addressline2 ?? "",
      pickup_city: rowData?.pickup_city ?? "",
      pickup_contact_personemail: rowData?.pickup_contact_personemail ?? "",
      pickup_contact_personname: rowData?.pickup_contact_personname ?? "",
      pickup_contact_personnumber: rowData?.pickup_contact_personnumber ?? "",
      pickup_state: rowData?.pickup_state ?? "",
      pickup_pincode: rowData?.pickup_pincode ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  let formValues: any = form.values;

  const [oLoader, setOLoader] = useState<boolean>(false);
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);

  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  let phoneLen = calculatePhoneLen(userData?.selectedCountry?.country_code);

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    let states = await readStates(filterBy, filterQuery);
    states = filterData(states, "label", "value");
    setStatesData(states);
  }

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    cities = await readCities(filterBy, filterQuery);
    cities = filterData(cities, "label", "value");
    setCitiesData(cities);
  }

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await dynamicDataUpdate("warehouses", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readApiData("warehouses");
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Warehouse ${rowData.name} updated!`,
        message: `The above Warehouse has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("warehouses", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const boards = await readApiData("warehouses");
        setData(boards);
        setOLoader(false);
        notifications.show({
          title: `Warehouse created!`,
          message: `A new Warehouse has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Warehouse already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }

    close();
  };

  useEffect(() => {
    selectedCountry && readStatesData();
  }, [selectedCountry]);

  useEffect(() => {
    formValues?.pickup_state && readCitiesData("state", formValues?.pickup_state);
  }, [formValues?.pickup_state]);

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
        label: "Pickup Address line 1",
        placeholder: "Pickup Address line 1",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_addressline1"),
      },
      {
        disabled: readonly,
        label: "Pickup Address line 2",
        placeholder: "Pickup Address line 2",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_addressline2"),
      },
      {
        inputType: "dropdown",
        disabled: readonly,
        data: statesData,
        label: "Pickup State",
        placeholder: "Pickup State",
        w: "100%",
        mt: "md",
        size: "md",

        ...form.getInputProps("pickup_state"),
        onChange: (e: any) => {
          form.setFieldValue("pickup_city", "");
          form.setFieldValue("pickup_state", e);
        },
      },
      {
        inputType: "dropdown",
        data: citiesData,
        disabled: readonly,
        label: "Pickup City",
        placeholder: "Pickup City",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_city"),
      },
      {
        disabled: readonly,
        label: "Pickup Pincode",
        placeholder: "Pickup Pincode",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_pincode"),
        onChange: (e: any) => {
          let val = validatePhone(e.target.value, 6);
          form.setFieldValue("pickup_pincode", val);
        },
      },
      {
        disabled: readonly,
        label: "Pickup Contact Person name",
        placeholder: "Pickup Contact Person name",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_contact_personname"),
      },
      {
        disabled: readonly,
        label: "Pickup Contact Person Number",
        placeholder: "Pickup Contact Person Number",
        w: "100%",
        mt: "md",
        size: "md",
        ...form.getInputProps("pickup_contact_personnumber"),
        onChange: (e: any) => {
          let val = validatePhone(e.target.value, phoneLen);
          form.setFieldValue("pickup_contact_personnumber", val);
        },
      },
      {
        disabled: readonly,
        label: "Pickup Contact Person Email",
        placeholder: "Pickup Contact Person Email",
        w: "100%",
        mt: "md",
        size: "md",
        style: { width: "97%" },
        ...form.getInputProps("pickup_contact_personemail"),
        onChange: (e: any) => {
          let val = emailFormat(e.target.value);
          form.setFieldValue("pickup_contact_personemail", val);
        },
      },
    ];

    return formData.map((item: any, index) => {
      if (item.inputType == "editor") {
        return <Editor key={index} {...item} />;
      } else if (item.inputType == "dropdown") {
        return <Select clearable searchable={true} style={{ width: "46%" }} key={index} {...item} />;
      } else {
        return <TextInput style={{ width: "46%" }} key={index} {...item} />;
      }
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)} className="pb-2">
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <div className="d-flex w-100 gap-2 flex-wrap justify-content-around">{renderFormData()}</div>
        {!readonly && (
          <Group position="center" mt="lg">
            <button
              className="form-control btn btn-primary"
              style={{ maxWidth: "97%" }}
              disabled={readonly}
              type="submit"
            >
              Submit
            </button>
          </Group>
        )}
      </form>
    </Box>
  );
}

export { WarehouseForm };
