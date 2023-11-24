import { TextInput, Button, Group, Box, Flex, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import { createCompetition, readClasses, readCompetitions, readData, updateCompetition } from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { getReduxState } from "@/redux/hooks";
import Editor from "../editor/editor";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";
import { validatePhone } from "@/helpers/validations";
import { filterData } from "@/helpers/filterData";

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
  const [classesData, setClassesData] = useState<any>([]);

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

  async function readClassesData(filterBy?: "name" | "status", filterQuery?: string | number) {
    let classes: any = await readClasses();
    classes = filterData(classes, "label", "value", "", true, "order_code", undefined, true);
    // classes.unshift("all");
    setClassesData(classes);
  }

  useEffect(() => {
    readClassesData();
  }, []);

  const form = useForm({
    initialValues: rowData,

    validate: {
      name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
      subject_id: (value) => (value.length < 2 ? "Subject must have at least 2 letters" : null),
      parent_competition_id: (value) => (value.length < 2 ? "Parent competition must have at least 2 letters" : null),
      code: (value) => (value.length < 1 ? "Code must have at least 1 letters" : null),
      mode_id: (value) => (value.length === 0 ? "Mode must be selected" : null),
    },
  });
  let formValues: any = form.values;
  const [oLoader, setOLoader] = useState<boolean>(false);
  let reduxData = useSelector((state: any) => state.data);
  let selectedCountryLocal = setGetData("selectedCountry", "", true);

  const getSelectedCountry = () => {
    return reduxData?.selectedCountry?.country_code || selectedCountryLocal?.country_code || "";
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

  const classesDataJson = () => {
    let data: any = [];
    classesData.map((item: any) => {
      let dataItem = {
        disabled: readonly,
        divStyle: { width: "18%" },
        label: item.name,
        placeholder: "99",
        ...form.getInputProps("class" + item._id),
        w: "100%",
        mt: "md",
        size: "md",
        onChange: (event: any) => {
          let val = validatePhone(event.currentTarget.value, 3);
          form.setFieldValue("class" + item._id, val);
        },
      };
      data.push(dataItem);
    });

    return data;
  };

  let dataObj = [
    {
      disabled: readonly,
      withAsterisk: true,
      label: "Name",
      placeholder: "John Doe",
      ...form.getInputProps("name"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        form.setFieldValue("name", event.currentTarget.value);
      },
    },
    {
      disabled: readonly,
      withAsterisk: true,
      label: "code",
      placeholder: "123",
      ...form.getInputProps("code"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        form.setFieldValue("code", event.currentTarget.value);
      },
    },
    {
      type: "dropdown",
      disabled: readonly,
      searchable: true,
      nothingFound: "No options",
      data: subjectNames,
      name: "subject_id",
      withAsterisk: true,
      label: "Subject",
      ...form.getInputProps("subject_id"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: async (event: any) => {
        form.setFieldValue("subject_id", event ?? "");
      },
    },
    {
      type: "dropdown",
      disabled: readonly,
      searchable: true,
      nothingFound: "No options",
      data: ["Online", "Offline", "Both"],
      name: "Mode",
      withAsterisk: true,
      label: "Mode",
      ...form.getInputProps("mode_id"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: async (event: any) => {
        form.setFieldValue("mode_id", event ?? "");
      },
    },
    {
      disabled: readonly,
      withAsterisk: true,
      label: "Parent Competition",
      placeholder: "Mathematics",
      ...form.getInputProps("parent_competition_id"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        form.setFieldValue("parent_competition_id", event.currentTarget.value);
      },
    },
    {
      disabled: readonly,
      label: "Tags",
      placeholder: "Tag1",
      ...form.getInputProps("tags"),

      mt: "md",
      size: "md",
      onChange: (event: any) => {
        form.setFieldValue("tags", event.currentTarget.value);
      },
    },
    {
      type: "dropdown",
      disabled: readonly,
      searchable: true,
      nothingFound: "No options",
      data: ["Paid", "Free", "Both"],
      name: "charges",
      withAsterisk: true,
      label: "Charges",
      ...form.getInputProps("charges"),

      mt: "md",
      size: "md",
      onChange: async (event: any) => {
        form.setFieldValue("charges", event ?? "");
      },
    },
    {
      disabled: readonly,
      // divStyle: { width: "100%" },
      label: "Passing Marks(%)",
      placeholder: "99",
      ...form.getInputProps("passing_marks"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val = validatePhone(event.currentTarget.value, 3, 100);
        form.setFieldValue("passing_marks", val);
      },
    },
    { title: "Grade Setting" },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade A min (%)",
      placeholder: "99",
      ...form.getInputProps("grade_a_min"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val = validatePhone(event.currentTarget.value, 3, !!formValues.grade_a_max ? +formValues.grade_a_max : 100);
        form.setFieldValue("grade_a_min", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade A max (%)",
      placeholder: "99",
      ...form.getInputProps("grade_a_max"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val: any = validatePhone(event.currentTarget.value, 3, 100);
        if (val < Number(formValues?.grade_a_min)) {
          val = formValues.grade_a_min;
        }
        form.setFieldValue("grade_a_max", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade B min (%)",
      placeholder: "99",
      ...form.getInputProps("grade_b_min"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val = validatePhone(event.currentTarget.value, 3, !!formValues.grade_b_max ? +formValues.grade_b_max : 100);
        form.setFieldValue("grade_b_min", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade B max (%)",
      placeholder: "99",
      ...form.getInputProps("grade_b_max"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val: any = validatePhone(event.currentTarget.value, 3, 100);
        if (val < Number(formValues?.grade_b_min)) {
          val = formValues.grade_b_min;
        }
        form.setFieldValue("grade_b_max", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade C min (%)",
      placeholder: "99",
      ...form.getInputProps("grade_c_min"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val = validatePhone(event.currentTarget.value, 3, !!formValues.grade_c_max ? +formValues.grade_c_max : 100);
        form.setFieldValue("grade_c_min", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade C max (%)",
      placeholder: "99",
      ...form.getInputProps("grade_c_max"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val: any = validatePhone(event.currentTarget.value, 3, 100);
        if (val < Number(formValues?.grade_c_min)) {
          val = formValues.grade_c_min;
        }
        form.setFieldValue("grade_c_max", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade D min (%)",
      placeholder: "99",
      ...form.getInputProps("grade_d_min"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val = validatePhone(event.currentTarget.value, 3, !!formValues.grade_d_max ? +formValues.grade_d_max : 100);
        form.setFieldValue("grade_d_min", val);
      },
    },
    {
      disabled: readonly,
      divStyle: { width: "22%" },
      label: "Grade D max (%)",
      placeholder: "99",
      ...form.getInputProps("grade_d_max"),
      w: "100%",
      mt: "md",
      size: "md",
      onChange: (event: any) => {
        let val: any = validatePhone(event.currentTarget.value, 3, 100);
        if (val < Number(formValues?.grade_d_min)) {
          val = formValues.grade_d_min;
        }
        form.setFieldValue("grade_d_max", val);
      },
    },
    { title: "Cut-off Marks Setting for Grand Finale" },
    ...classesDataJson(),
    {
      type: "editor",
      readOnly: readonly,
      placeholder: "Any additional notes regarding the competition should go here.",
      label: "Message",
      ...form.getInputProps("message"),
    },
  ];

  const returnData = () => {
    return dataObj.map((item: any, index: any) => {
      if (item.title) {
        return (
          <div key={index} className="bold w-100">
            {item.title}
          </div>
        );
      } else if (item.type == "dropdown") {
        return (
          <div key={index} style={{ minWidth: "48%" }}>
            <Select {...item} />
          </div>
        );
      } else if (item.type == "editor") {
        return (
          <div key={index} style={{ minWidth: "48%" }}>
            <Editor {...item} />
          </div>
        );
      } else {
        return (
          <div key={index} style={{ width: "48%", ...item.divStyle }}>
            <TextInput {...item} />
          </div>
        );
      }
    });
  };

  return (
    <Box maw={"100%"} mx="auto">
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <LoadingOverlay visible={oLoader} overlayBlur={2} />
        <div className="d-flex flex-wrap w-100 gap-3 justify-content-between">{returnData()}</div>
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
