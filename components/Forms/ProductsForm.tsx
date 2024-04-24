import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  LoadingOverlay,
  Select,
  MultiSelect,
  Radio,
  Checkbox,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MatrixDataType, MatrixRowType } from "../Matrix";
import {
  createProduct,
  readBoards,
  readClasses,
  readCompetitions,
  readProductCategories,
  readProducts,
  readSubjects,
  updateProduct,
  uploadMedia,
} from "@/utilities/API";
import { notifications } from "@mantine/notifications";
import { ProductsType } from "@/utilities/api-types";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import { filterDataSingle } from "@/helpers/dropDownData";
import { validatePhone } from "@/helpers/validations";
import Loader from "../common/Loader";
import Editor from "../editor/editor";
import { useSelector } from "react-redux";
import { DateinputCustom } from "../utils";
import { filterData } from "@/helpers/filterData";
import { findFromJson } from "@/helpers/filterFromJson";

function ProductForm({
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
  const [visible, { toggle, close: closeOverlay, open: openOverlay }] = useDisclosure(true);
  const [productTypes, setProductTypes] = useState<MatrixDataType>([]);
  const [boards, setBoards] = useState<MatrixDataType>([]);
  const [classes, setClasses] = useState<MatrixDataType>([]);
  const [subjects, setSubjects] = useState<MatrixDataType>([]);
  const [competitions, setCompetitions] = useState<MatrixDataType>([]);
  const [products, setProducts] = useState<MatrixDataType>([]);
  const [selectedRecords, setSelectedRecords] = useState<ProductsType[]>(rowData?.products ?? []);
  const [loader, setLoader] = useState<any>(false);

  const redux = useSelector((state: any) => state.data);
  const country: any = redux?.selectedCountry;
  let taxCodes = country?.tax_code;

  const form = useForm({
    initialValues: {
      loginrequired: false,
      showfront: false,
      showinaccount: false,
      associatedwithboard: false,
      showtoeligible: false,
      ...rowData,
    },
    validate: {
      name: (value: any) => (value?.length < 2 ? "Name must have at least 2 letters" : null),
    },
  });

  useEffect(() => {
    let val = 0;
    selectedRecords.map((record: any) => {
      val += +record?.product_bundle_price;
    });

    val && form.setFieldValue("product_bundle_price", val);
  }, [selectedRecords]);

  async function fetchProductTypes() {
    const productTypesRes = await readProductCategories();
    setProductTypes(productTypesRes);
  }

  async function fetchBoards() {
    const boardsRes = await readBoards();
    setBoards(boardsRes);
  }

  async function fetchClasses() {
    const classesRes = await readClasses();
    setClasses(classesRes);
  }

  async function fetchSubjects() {
    const subjectsRes = await readSubjects();
    setSubjects(subjectsRes);
    toggle();
  }

  async function fetchCompetitions(subjectName: string) {
    const competitionsRes = await readCompetitions("subject_id", subjectName);
    setCompetitions(competitionsRes);
  }

  // const getClassesValues = (classesArr: any, key = "_id") => {
  //   let newclasses: any = [];
  //   if (Array.isArray(classesArr)) {
  //     classesArr.map((item) => {
  //       let obj = findFromJson(classes, item, key);
  //       newclasses.push(obj.code);
  //     });
  //   } else {
  //     return [];
  //   }

  //   return newclasses;
  // };

  async function fetchProducts() {
    // let updatedClasses = getClassesValues(form.values.class);

    const productsRes = await readProducts("class", form.values.class);
    setProducts(productsRes);
  }

  useEffect(() => {
    if (form.values.class && form.values.bundle) {
      fetchProducts();
    }
  }, [form.values.bundle, form.values.class]);

  // Fetch Product Types
  useEffect(() => {
    fetchProductTypes();
    fetchBoards();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (rowData !== undefined) {
      if (readonly) setFormTitle(`View ${rowData.name}`);
      else setFormTitle(`Update ${rowData.name}`);
    } else {
      setFormTitle(`Add Product`);
    }
  }, []);

  const uploadFIleToCloud = async (file: any, key: any, values: any) => {
    let payload: any = new FormData();
    payload.append("file", file);
    payload.append("meta_data", JSON.stringify({ file_path: "products" }));
    setLoader(true);
    await uploadMedia(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.actual_url) {
          form.setFieldValue(key, res.data.actual_url ?? "");
          values[key] = res.data.actual_url;
          onHandleSubmit(values);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const onHandleSubmit = async (values: any) => {
    if (typeof values.resourcefileurl == "object") {
      await uploadFIleToCloud(values.resourcefileurl, "resourcefileurl", values);
      return;
    }

    if (typeof values.imageuploadurl == "object") {
      await uploadFIleToCloud(values.imageuploadurl, "imageuploadurl", values);
      return;
    }

    openOverlay();
    if (rowData !== undefined) {
      const isProductUpdated = await updateProduct(rowData._id, {
        ...values,
        products: selectedRecords,
      });
      if (isProductUpdated.toUpperCase() === "DOCUMENT UPDATED") {
        const products = await readProducts();
        setData(products);
        closeOverlay();
      } else {
        closeOverlay();
      }
      setRowData(undefined);
      notifications.show({
        title: `Product ${rowData.name} updated!`,
        message: `The above class has been updated with new information.`,
        color: "blue",
      });
    } else {
      const isProductCreated = await createProduct({
        ...values,
        products: selectedRecords,
        bundle: Boolean(selectedRecords.length),
      });
      if (isProductCreated.toUpperCase() === "DOCUMENT CREATED") {
        const products = await readProducts();
        setData(products);
        closeOverlay();
        notifications.show({
          title: `Product created!`,
          message: `A new product has been created.`,
          color: "green",
        });
      } else if (isProductCreated.toUpperCase() === "DOCUMENT ALREADY EXISTS") {
        closeOverlay();
        notifications.show({
          title: `Product already exists!`,
          message: `${values.name} already exists.`,
          color: "orange",
        });
      } else {
        closeOverlay();
      }
    }
    closeOverlay();
    close();
  };

  const onChangeSubject = (value: string | null) => {
    form.setFieldValue("subject_id", value ?? "");
    // fetchCompetitions(value ?? "");
  };

  // board_type

  const productTypesOptions = filterData(productTypes, "label", "value", "_id");
  let board_category = filterData(structuredClone(boards), "label", "value", "_id", false, false, "board_type");
  const classesOptions = filterData(classes, "label", "value", "code", true, "order_code", undefined, true);
  const subjectsOptions = filterData(subjects, "label", "value", "_id");
  const competitionsOptions = filterData(competitions, "label", "value", "_id");
  let boardsOptions = [];

  let formValues: any = form.values;

  if (formValues.boardcategory_id) {
    const boardType = findFromJson(boards, formValues.boardcategory_id, "_id");

    let dataBoard: any = [];
    boards.map((item) => {
      if (item.board_type == boardType?.board_type) {
        dataBoard.push(item);
      }
    });

    boardsOptions = filterData(dataBoard, "label", "value", "name");
  }

  useEffect(() => {
    // let subjectValue = findFromJson(subjectsOptions, formValues.subject_id, "_id");
    formValues.subject_id && fetchCompetitions(formValues?.subject_id ?? "");
  }, [formValues.subject_id]);

  const renderBundles = () => {
    if (!form.values.bundle) {
      return null;
    }

    if (!products.length) {
      return "No Products Available for the selected class";
    }

    return (
      <DataTable
        withBorder
        withColumnBorders
        records={products.filter((product) => !(product?.bundle ?? null)) as ProductsType[]}
        columns={[
          { accessor: "name" },
          { accessor: "hsncode" },
          { accessor: "product_bundle_price" },
          // { accessor: "delivery" },
          { accessor: "taxpercent" },
        ]}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        idAccessor="_id"
        isRecordSelectable={() => !rowData?.bundle}
      />
    );
  };

  const calculateTotalTax = (taxData: any) => {
    let taxpercent: any = 0;
    taxCodes.split(",").map((item: any, index: any) => {
      let ind: any;
      taxData.map((value: any, i: any) => {
        if (Object.keys(value).includes(item)) {
          if (value[item] && !isNaN(value[item])) {
            taxpercent += +value[item];
          }
        }
      });
    });

    if (taxpercent) {
      if (taxpercent != formValues?.taxpercent) {
        form.setFieldValue("taxpercent", taxpercent ?? []);
      }
    }
  };

  const renderTaxPercent = () => {
    let valuesLocal = formValues?.tax_code || [];

    if (taxCodes) {
      return taxCodes.split(",").map((item: any, index: any) => {
        let valObj: any = {};
        let ind: any;
        valuesLocal.map((value: any, i: any) => {
          if (Object.keys(value).includes(item)) {
            valObj = value;
            ind = i;
          }
        });

        if (!valuesLocal[ind] && !ind) {
          valuesLocal[index] = { [item]: "" };
          form.setFieldValue("tax_code", valuesLocal ?? []);
        }

        return (
          <TextInput
            key={index}
            disabled={readonly}
            withAsterisk
            label={item}
            placeholder={item}
            w={"100%"}
            mt={"md"}
            size="md"
            value={valObj[item] || ""}
            onChange={(event: any) => {
              let val = validatePhone(event.currentTarget.value, 3, 100);
              valObj[item] = val;
              if (valuesLocal[ind] && ind) {
                valuesLocal.splice(ind, 1, valObj);
              } else {
                valuesLocal[index] = valObj;
              }
              form.setFieldValue("tax_code", valuesLocal ?? []);
              calculateTotalTax(valuesLocal);
            }}
          />
        );
      });
    }
    return <></>;
  };

  return (
    <Box maw={"100%"} mx="auto">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={form.onSubmit(onHandleSubmit)}>
        <Flex direction={"column"} justify={"center"} align={"flex-start"} w={"100%"}>
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={productTypesOptions}
            label={"Product Types"}
            name="producttype"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("producttype_id")}
            onChange={(value) => {
              form.setFieldValue("producttype_id", value ?? "");
            }}
            w={"100%"}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="Board Category"
            data={board_category}
            label={"Board Category"}
            name="boardcategory"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("boardcategory_id")}
            // onChange={(value) => {
            //   form.setFieldValue("boardcategory", value ?? "");
            // }}
            w={"100%"}
          />
          <MultiSelect
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={boardsOptions}
            label={"Boards"}
            name="boards"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("boards")}
            onChange={(value) => {
              form.setFieldValue("boards", value ?? "");
            }}
            w={"100%"}
          />
          <MultiSelect
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={classesOptions}
            label={"Classes"}
            name="class"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("class")}
            w={"100%"}
          />
          <Radio.Group
            value={form.values.bundle ? "yes" : "no"}
            onChange={(value) => {
              form.setFieldValue("bundle", value === "yes");
            }}
            name="bundle"
            withAsterisk
            label="Which Product is this?"
            mt={"md"}
            size="md"
          >
            <Group mt="xs">
              <Radio value={"yes"} label="Bundle" disabled={readonly || Boolean(rowData?.bundle)} />
              <Radio value={"no"} label="Unit" disabled={readonly || Boolean(rowData?.bundle)} />
            </Group>
          </Radio.Group>
          <Box w={"100%"} mt="md">
            {renderBundles()}
          </Box>
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Title"
            placeholder="Title"
            {...form.getInputProps("name")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("name", event.currentTarget.value);
            }}
          />
          <Editor
            disabled={readonly}
            withAsterisk
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
          />
          <TextInput
            disabled={readonly}
            label="SKU Name"
            placeholder="SKU Name"
            {...form.getInputProps("sku_name")}
            w={"100%"}
            style={{ marginTop: 40 }}
            size="md"
            onChange={(event) => {
              form.setFieldValue("sku_name", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            label="SKU Code"
            placeholder="SKU Code"
            {...form.getInputProps("sku_code")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("sku_code", event.currentTarget.value);
            }}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={subjectsOptions}
            label={"Subjects"}
            name="subject"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("subject_id")}
            onChange={onChangeSubject}
            w={"100%"}
          />
          <Select
            clearable
            disabled={readonly}
            searchable
            nothingFound="No options"
            data={competitionsOptions}
            label={"Competitions"}
            name="competition"
            mt={"md"}
            size="md"
            withAsterisk
            {...form.getInputProps("competition_id")}
            onChange={(value) => {
              form.setFieldValue("competition_id", value ?? "");
            }}
            w={"100%"}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="HSN Code"
            placeholder="HSN Code"
            {...form.getInputProps("hsncode")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              // let val = validatePhone(event.currentTarget.value, 8);
              form.setFieldValue("hsncode", event.currentTarget.value);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Inventry Quantity"
            placeholder="Inventry Quantity"
            {...form.getInputProps("qty")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value);
              form.setFieldValue("qty", val);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Amount"
            placeholder="Amount"
            {...form.getInputProps("amount")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 0, undefined, true, form.values.amount);
              form.setFieldValue("amount", val);
            }}
          />
          <TextInput
            disabled={readonly}
            withAsterisk
            label="Product Bundle Price"
            placeholder="Product Bundle Price"
            {...form.getInputProps("product_bundle_price")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 0, undefined, true, formValues?.product_bundle_price);
              form.setFieldValue("product_bundle_price", val);
            }}
          />
          {renderTaxPercent()}
          {/* <TextInput
            disabled={readonly || form.values.bundle}
            label="Tax Name"
            placeholder="Tax Name"
            {...form.getInputProps("taxname")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("taxname", event.currentTarget.value);
            }}
          /> */}
          {/* <TextInput
            disabled={readonly || form.values.bundle}
            label="Tax Percent"
            placeholder="Tax Percent"
            {...form.getInputProps("taxpercent")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 3, 100);
              form.setFieldValue("taxpercent", val);
            }}
          /> */}
          <DateinputCustom
            inputProps={{
              disabled: readonly,
              withAsterisk: true,
              label: "Last Buying Date",
              placeholder: "Last Buying Date",
              ...form.getInputProps("lastbuyingdate"),
              w: "100%",
              mt: "md",
              size: "md",
              onChange: (val: any) => {
                form.setFieldValue("lastbuyingdate", val);
              },
            }}
          />
          <DateinputCustom
            inputProps={{
              disabled: readonly,
              withAsterisk: true,
              label: "Last Access Date",
              placeholder: "Last Access Date",
              ...form.getInputProps("lastaccessdate"),
              w: "100%",
              mt: "md",
              size: "md",
              onChange: (val: any) => {
                form.setFieldValue("lastaccessdate", val);
              },
            }}
          />
          {/* <TextInput
            disabled={readonly}
            withAsterisk
            label="Seq Number"
            placeholder="Seq Number"
            {...form.getInputProps("seqnumber")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              let val = validatePhone(event.currentTarget.value, 3);
              form.setFieldValue("seqnumber", val);
            }}
          /> */}
          <FileInput
            disabled={readonly}
            withAsterisk
            label="Resource File"
            placeholder={formValues?.resourcefileurl || "Resource File"}
            {...form.getInputProps("resourcefileurl")}
            w={"100%"}
            mt={"md"}
            size="md"
            accept=".pdf, .xls, .xlsx, .doc, .docx, .zip, .rar, image/*"
            onChange={(event) => {
              form.setFieldValue("resourcefileurl", event);
            }}
            rightSection={formValues?.resourcefileurl ? <span className="material-symbols-outlined">folder</span> : ""}
          />
          <span style={{ fontSize: "12px" }}>
            {typeof formValues?.resourcefileurl == "string" ? formValues?.resourcefileurl : ""}
          </span>
          {/* {formValues?.resourcefileurl && (
            <div className="m-3">
              {typeof formValues?.resourcefileurl === "object" ? (
                <img style={{ height: "150px" }} src={URL.createObjectURL(formValues?.resourcefileurl)} />
              ) : (
                <img style={{ height: "150px" }} src={formValues?.resourcefileurl} />
              )}
            </div>
          )} */}
          <FileInput
            disabled={readonly}
            withAsterisk
            label="image upload url "
            placeholder={formValues?.imageuploadurl || "image upload url"}
            {...form.getInputProps("imageuploadurl")}
            w={"100%"}
            mt={"md"}
            size="md"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              form.setFieldValue("imageuploadurl", event);
            }}
          />
          {formValues?.imageuploadurl && (
            <div className="m-3">
              {typeof formValues?.imageuploadurl === "object" ? (
                <img style={{ height: "150px" }} src={URL.createObjectURL(formValues?.imageuploadurl)} />
              ) : (
                <img style={{ height: "150px" }} src={formValues?.imageuploadurl} />
              )}
            </div>
          )}
          <Checkbox
            checked={!!formValues?.showfront}
            disabled={readonly}
            label="Show Front"
            placeholder="Show Front"
            {...form.getInputProps("showfront")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showfront", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.showinaccount}
            disabled={readonly}
            label="Show Inaccount"
            placeholder="Show Inaccount"
            {...form.getInputProps("showinaccount")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showinaccount", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.associatedwithboard}
            disabled={readonly}
            label="Associated With Board"
            placeholder="Associated With Board"
            {...form.getInputProps("associatedwithboard")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("associatedwithboard", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.loginrequired}
            disabled={readonly}
            label="Login Required"
            placeholder="Login Required"
            {...form.getInputProps("loginrequired")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("loginrequired", event.target.checked);
            }}
          />
          <Checkbox
            checked={!!formValues?.showtoeligible}
            disabled={readonly}
            label="Show To Eligible"
            placeholder="Show To Eligible"
            {...form.getInputProps("showtoeligible")}
            w={"100%"}
            mt={"md"}
            size="md"
            onChange={(event) => {
              form.setFieldValue("showtoeligible", event.target.checked);
            }}
          />
        </Flex>
        <Group position="right" mt="md">
          <Button disabled={readonly} type="submit">
            Submit
          </Button>
          <Loader show={loader} />
        </Group>
      </form>
    </Box>
  );
}

export { ProductForm };
