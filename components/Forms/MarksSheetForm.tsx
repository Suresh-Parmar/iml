import { TextInput, Checkbox, Button, Group, Box, Flex, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { dynamicCreate, dynamicDataUpdate, readApiData, readClasses } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import Editor from "../editor/editor";
import { filterData } from "@/helpers/filterData";
import { useSelector } from "react-redux";
import { validateAlpha, validatePhone } from "@/helpers/validations";

function MarksSheetForm({
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
  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Marks Sheet ${rowData.name}`);
    } else {
      setFormTitle(`Add Marks Sheet`);
    }
  }, []);
  const form = useForm({
    initialValues: {
      name: rowData?.name ?? "",
      series: rowData?.series ?? "",
      class: rowData?.class ?? "",
      rank: rowData?.rank ?? "",
      grade: rowData?.grade ?? "",
      percent: rowData?.percent ?? "",
      seatnumber: rowData?.seatnumber ?? "",
      totalmarks: rowData?.totalmarks ?? "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  const [oLoader, setOLoader] = useState<boolean>(false);
  const [classesData, setClassesData] = useState<any>([]);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes: any = await readClasses();
    classes = filterData(classes, "label", "value", "code", true, "code");
    setClassesData(classes);
  }

  useEffect(() => {
    readClassesData();
  }, [selectedCountry]);

  const onHandleSubmit = async (values: any) => {
    setOLoader(true);
    if (rowData !== undefined) {
      const isBoardUpdated = await dynamicDataUpdate("marks", rowData._id, values);
      if (isBoardUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const boards = await readApiData("marks");
        setData(boards);
        setOLoader(false);
      } else {
        setOLoader(false);
      }
      setRowData(undefined);
      notifications.show({
        title: `Marks Sheet ${rowData.name} updated!`,
        message: `The above Marks Sheet has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isBoardCreated = await dynamicCreate("marks", values as MatrixRowType);
      if (isBoardCreated.toUpperCase() === "DOCUMENT CREATED") {
        const data = await readApiData("marks");
        setData(data);
        setOLoader(false);
        notifications.show({
          title: `Marks Sheet created!`,
          message: `A new Marks Sheet has been created.`,
          color: "green",
        });
      } else if (isBoardCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        setOLoader(false);
        notifications.show({
          title: `Marks Sheet already exists!`,
          message: `${values.name} (${values.code}) already exists.`,
          color: "orange",
        });
      } else {
        setOLoader(false);
      }
    }

    close();
  };

  let renderFormData = () => {
    let formData = [
      {
        disabled: readonly,
        label: "Registration No.",
        placeholder: "123456",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("name"),
        onChange: (e: any) => {
          let val = validatePhone(e.target.value, 15);
          form.setFieldValue("name", val);
        },
      },
      {
        disabled: readonly,
        label: "Seat No.",
        placeholder: "123456",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("seatnumber"),
        onChange: (e: any) => {
          let val = validateAlpha(e.target.value);
          form.setFieldValue("seatnumber", val);
        },
      },
      {
        disabled: readonly,
        label: "Marks %",
        placeholder: "99",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("percent"),
        onChange: (e: any) => {
          let val = validatePhone(e.target.value, 3, 100);
          form.setFieldValue("percent", val);
        },
      },
      {
        disabled: readonly,
        label: "Grade",
        placeholder: "B",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("grade"),
      },

      {
        disabled: readonly,
        label: "Series",
        placeholder: "A",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("series"),
      },
      {
        disabled: readonly,
        label: "Total Marks",
        placeholder: "100",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("totalmarks"),
        onChange: (e: any) => {
          let val = validatePhone(e.target.value, 4);
          form.setFieldValue("totalmarks", val);
        },
      },
      {
        disabled: readonly,
        label: "Class",
        type: "select",
        placeholder: "class 1",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("class"),
        data: classesData,
        // onChange: (e: any) => {
        //   console.log(e);
        //   // handleDropDownChange(e, "select_class");
        // },
      },
      {
        disabled: readonly,

        label: "Rank",
        placeholder: "1st",
        w: "47%",
        mt: "md",
        size: "md",
        ...form.getInputProps("rank"),
      },
    ];

    return formData.map((item: any, index) => {
      if (item.type == "select") {
        return <Select searchable={true} size="sm" key={index} {...item} />;
      } else {
        return <TextInput key={index} {...item} />;
      }
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <div style={{ display: "flex", width: "100%", flexWrap: "wrap", justifyContent: "space-evenly", gap: "20px" }}>
          {renderFormData()}
        </div>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default MarksSheetForm;
