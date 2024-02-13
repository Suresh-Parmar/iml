import {
  dispatchRequest,
  readApiData,
  readCities,
  readPayments,
  readProducts,
  readRelationshipManagers,
  readSchools,
  readStates,
  readStudents,
} from "@/utilities/API";
import { Group, MultiSelect, Radio, Select, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import { validatePhone } from "@/helpers/validations";
import { formTypeToFetcherMapper } from "@/helpers/dataFetcher";
import { notifications } from "@mantine/notifications";
import { findFromJson } from "@/helpers/filterFromJson";
import { useFinduserGeoLocationQuery } from "@/redux/apiSlice";
import { iterateData } from "@/helpers/getData";
import { filterData } from "@/helpers/filterData";

function DispatchForm(props: any) {
  const { formType, setData, close, rowData, readonly } = props;
  let isUpdate = !!rowData;
  let allFormData = rowData || {};
  let dataForUpdate = structuredClone(allFormData);

  if (!dataForUpdate?.products) {
    dataForUpdate.products = [{}];
  }

  const [allData, setAllData] = useState<any>(dataForUpdate);
  const [citiesData, setCitiesData] = useState<any>([]);
  const [statesData, setStatesData] = useState<any>([]);
  const [schoolsDataDropDown, setSchoolsDataDropDown] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [rmData, setRMData] = useState<any>([]);
  const [studentsData, setStudentsData] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [courierData, setcourierData] = useState<any>([]);
  const [statusData, setstatusData] = useState<any>([]);

  const [nestedData, setNestedData] = useState<any>(allData.products);

  const state: any = useSelector((state: any) => state.data);
  const countryName = state?.selectedCountry?.label;

  // fetch data

  async function readStatesData(filterBy?: "country", filterQuery?: string | number) {
    setLoader(true);
    let states = await readStates(filterBy, filterQuery);
    setLoader(false);
    states = filterData(states, "label", "value", "_id");
    setStatesData(states);
  }

  async function readStatusData(filterBy?: "country", filterQuery?: string | number) {
    setLoader(true);
    let newData = await readApiData("dispatch_status");
    setLoader(false);
    newData = filterData(newData, "label", "value", "_id");
    setstatusData(newData);
  }

  const readReadRelationshipManagers = async () => {
    setLoader(true);
    const rm = await readRelationshipManagers();
    setLoader(false);
    let newData = filterData(rm, "label", "value", "_id");
    setRMData(newData);
  };

  const readStudentsData = async () => {
    setLoader(true);
    const students = await readStudents();
    let newData = filterData(students, "label", "value", "_id");
    setLoader(false);

    setStudentsData(newData);
  };

  async function readCitiesData(filterBy?: "state", filterQuery?: string | number) {
    let cities: any[];
    cities = await readCities(filterBy, filterQuery);
    cities = filterData(cities, "label", "value", "_id");
    setCitiesData(cities);
  }

  async function readSchoolsData() {
    let cityName = findFromJson(citiesData, allData.city_id, "_id");
    setLoader(true);
    const schools = await readSchools("city", cityName.name);
    setLoader(false);
    let data = filterData(schools, "label", "value", "_id");
    setSchoolsDataDropDown(data);
  }

  let readProductsData = async () => {
    setLoader(true);
    const products = await readProducts();
    setLoader(false);
    let data = filterData(products, "label", "value", "_id");
    setProducts(data);
  };

  const fetchCourierName = async () => {
    setLoader(true);
    const newData = await readApiData("warehouses");
    setLoader(false);
    let data = filterData(newData, "label", "value", "_id");
    setcourierData(data);
  };

  // fetch data

  useEffect(() => {
    if (countryName) {
      fetchCourierName();
      readStatesData();
      readReadRelationshipManagers();
      readStudentsData();
      readProductsData();
      readStatusData();
    }
  }, [countryName]);

  useEffect(() => {
    let stateName = findFromJson(statesData, allData.state_id, "_id");

    allData.state_id && readCitiesData("state", stateName.name);
  }, [allData.state_id]);

  useEffect(() => {
    allData.city_id && readSchoolsData();
  }, [allData.city_id]);

  const handleDropDownChange = (e: any, key: any, clear?: any) => {
    if (clear) {
      if (clear == "all") {
        setAllData({ [key]: e });
      } else {
        setAllData({ ...allData, [clear]: "", [key]: e });
      }
    } else {
      setAllData({ ...allData, [key]: e });
    }
  };

  let calculateNumbers = (num1: any, num2: any, isMultiply: any = false, key: any = "", item: any = "") => {
    if (isMultiply) {
      if (num1 && num2) {
        if (isNaN(num1 * num2)) {
          return "";
        } else {
          let val = Number(num1 * num2).toFixed(2);
          if (key) allData[key] = val;
          if (item) item[key] = val;
          return val;
        }
      }
    } else {
      if (num1 && num2) {
        if (isNaN(num1 / num2)) {
          return "";
        } else {
          let val = Number(num1 / num2).toFixed(2);
          if (key) allData[key] = val;
          if (item) item[key] = val;
          return val;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    if (allFormData?.receiver_type) {
      allData.filterTypeStudent = String(allFormData.receiver_type).toLowerCase();
      let singleData = prepareDropDownData(allData.filterTypeStudent) || {};
      allData.childSchoolData = singleData;
      allData[singleData?.key] = allFormData.registration_number;
      setAllData({ ...allData });
    }
  }, [allFormData, schoolsDataDropDown, studentsData, rmData]);

  let prepareDropDownData = (findByLabel: any = "") => {
    let data: any = {
      student: { data: studentsData, label: "Student", key: "select_Student" },
      rm: { data: rmData, label: "RM", key: "select_RM" },
      school: { data: schoolsDataDropDown, label: "School", key: "select_school" },
    };

    if (findByLabel) {
      return data[findByLabel];
    }
    return data;
  };

  let calculateData = (key: any) => {
    let all = 0;
    allData.products.map((item: any) => {
      all += +item[key];
    });
    return all;
  };

  const calcuLateWeight = () => {
    let val = 0;
    allData.products.map((item: any, index: any) => {
      let data = findFromJson(products, item.sku_name, "value");
      if (!isNaN(+data.weight)) {
        val += +data.weight;
      }
      if (item.quantity) {
        val *= item.quantity;
      }
    });

    allData.approx_weight = val;
    setAllData({ ...allData });
  };

  useEffect(() => {
    calcuLateWeight();
  }, [products, allData.products]);

  let handleNestedFieldData = (key: any, val: any, nestedKey: any) => {
    if (allData[nestedKey]) {
      allData[nestedKey][key] = val;
    } else {
      allData[nestedKey] = { [key]: val };
    }
    setAllData({ ...allData });
  };

  const studentFilters = [
    {
      label: "State",
      type: "select",
      style: { minWidth: "48%" },
      data: statesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "state_id", "city");
      },
      value: allData.state_id,
    },
    {
      label: "City",
      style: { minWidth: "48%" },
      type: "select",
      data: citiesData,
      onChange: (e: any) => {
        handleDropDownChange(e, "city_id", "filterTypeStudent");
      },
      value: allData.city_id,
    },
    {
      style: { minWidth: "48%" },
      label: "School / RM / Student",
      type: "radio",
      options: [
        { label: "School", value: "school", fetch: "" },
        { label: "RM", value: "rm", fetch: "" },
        { label: "Student", value: "student", fetch: "" },
      ],
      onChange: (e: any) => {
        let data: any = prepareDropDownData();
        data = data[e];
        allData.childSchoolData = data;
        handleDropDownChange(e, "filterTypeStudent");
      },
      value: allData.filterTypeStudent,
    },
    {
      hide: !allData.filterTypeStudent,
      label: allData?.childSchoolData?.label || "Select School",
      placeholder: allData?.childSchoolData?.label || "Select School",
      data: allData?.childSchoolData?.data || schoolsDataDropDown,
      style: { minWidth: "48%" },
      type: "select",
      onChange: (e: any) => {
        handleDropDownChange(e, allData?.childSchoolData?.key || "select_school");
      },
      value: allData[allData?.childSchoolData?.key || "select_school"] || "",
    },

    {
      disabled: true,
      label: "Order No.",
      style: { minWidth: "31%" },
      type: "text",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "order_number");
      },
      value: allData.order_number || "",
    },
    {
      disabled: true,
      label: "Invoice No.",
      style: { minWidth: "31%" },
      type: "text",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "invoice_number");
      },
      value: allData.invoice_number || "",
    },
    {
      label: "E-way Bill No.",
      withAsterisk: calculateData("amount") > 50000,
      style: { minWidth: "31%" },
      type: "text",
      disabled: calculateData("amount") < 50000 || !calculateData("amount"),
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "eway_bill_no");
      },
      value: allData["eway_bill_no"] || "",
    },
  ];

  const fields = [
    {
      style: { widht: "10%" },
      label: "Approx Weight",
      placeholder: "Approx Weight",
      disabled: true,
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "approx_weight");
      },
      value: allData.approx_weight || "",
    },
    {
      style: { widht: "10%" },
      label: "Actual Weight",
      placeholder: "Actual Weight",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "actual_weight");
      },
      value: allData.actual_weight || "",
    },
    {
      style: { widht: "10%" },
      label: "No. Of Boxes",
      placeholder: "No. Of Boxes",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value, 5);
        handleDropDownChange(val, "boxes");
      },
      value: allData.boxes || "",
    },
    {
      style: { widht: "10%" },
      label: "Weight",
      placeholder: "Weight",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value, 5);
        handleNestedFieldData("weight", val, "packaging_unit_details");
      },
      value: allData.packaging_unit_details?.weight || "",
    },
    {
      style: { widht: "10%" },
      label: "Length",
      placeholder: "Length",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value, 5);
        handleNestedFieldData("length", val, "packaging_unit_details");
      },
      value: allData.packaging_unit_details?.length || "",
    },
    {
      style: { widht: "10%" },
      label: "Height",
      placeholder: "Height",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value, 5);
        handleNestedFieldData("height", val, "packaging_unit_details");
      },
      value: allData.packaging_unit_details?.height || "",
    },
    {
      style: { widht: "10%" },
      label: "Width",
      placeholder: "Width",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value, 5);
        handleNestedFieldData("width", val, "packaging_unit_details");
      },
      value: allData.packaging_unit_details?.width || "",
    },
    {
      disabled: true,
      style: { widht: "10%" },
      label: "Weight Per Box",
      placeholder: "Weight Per Box",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "weight_per_box");
      },
      value:
        calculateNumbers(allData.actual_weight, allData.boxes, false, "weight_per_box") || allData.weight_per_box || "",
    },
    {
      disabled: true,
      style: { widht: "10%" },
      label: "Awb No.",
      placeholder: "Awb No.",
      onChange: (e: any) => {
        let val = validatePhone(e.target.value);
        handleDropDownChange(val, "awb_number");
      },
      value: allData.awb_number || "",
    },
    {
      type: "select",
      data: courierData,
      style: { minWidth: "48%" },
      label: "Warehouse Name",
      placeholder: "Warehouse Name",
      onChange: (e: any) => {
        handleDropDownChange(e, "warehouse_name");
      },
      value: allData.warehouse_name || "",
    },

    // {
    //   type: "date",
    //   style: { minWidth: "48%" },
    //   label: "Dispatch Date",
    //   placeholder: "Dispatch Date",
    //   onChange: (e: any) => {
    //     handleDropDownChange(e.target.value, "dispatch_date");
    //   },
    //   value: allData.dispatch_date || "",
    // },
    // {
    //   type: "date",
    //   style: { minWidth: "48%" },
    //   label: "Delivery Date",
    //   placeholder: "Delivery Date",
    //   onChange: (e: any) => {
    //     handleDropDownChange(e.target.value, "delivery_date");
    //   },
    //   value: allData.delivery_date || "",
    // },
    {
      style: { minWidth: "48%" },
      label: `Receiver's Name`,
      placeholder: `Reciever's Name`,
      key: `receiver_name`,
      onChange: (e: any) => {
        handleDropDownChange(e.target.value, `receiver_name`);
      },
      value: allData[`receiver_name`] || "",
    },
    {
      style: { minWidth: "48%" },
      label: "Packed By",
      placeholder: "Packed By",
      onChange: (e: any) => {
        handleDropDownChange(e.target.value, "packed_by");
      },
      value: allData.packed_by || "",
    },
    {
      style: { minWidth: "48%" },
      label: "Checked By",
      placeholder: "Checked By",
      onChange: (e: any) => {
        handleDropDownChange(e.target.value, "checked_by");
      },
      value: allData.checked_by || "",
    },
    {
      type: "select",
      data: statusData,
      style: { minWidth: "48%" },
      label: "Status",
      placeholder: "Status",
      onChange: (e: any) => {
        handleDropDownChange(e, "status");
      },
      value: allData.status || "",
    },
  ];

  const renderRadio = (item: any) => {
    const renderInputs = () => {
      return item.options.map((itemChild: any, index: any) => {
        return <Radio key={index} value={itemChild.value} label={itemChild.label} />;
      });
    };

    return (
      <Radio.Group {...item}>
        <Group mt="xs">{renderInputs()}</Group>
      </Radio.Group>
    );
  };

  const renderData = () => {
    return studentFilters.map((item: any, index) => {
      if (item.hide) return;
      let { type, style } = item;
      if (type === "multiselect") {
        return (
          <div key={index} style={{ ...style }}>
            <MultiSelect disabled={readonly} searchable={true} size="sm" {...item} />
          </div>
        );
      } else if (type == "radio") {
        return <div key={index}>{renderRadio(item)}</div>;
      } else if (type == "select") {
        return (
          <div key={index} style={{ ...style }}>
            <Select clearable disabled={readonly} searchable={true} mt={"md"} size="md" {...item} />
          </div>
        );
      } else {
        return (
          <div key={index} style={style}>
            <TextInput disabled={readonly} mt={"md"} size="md" {...item} />
          </div>
        );
      }
    });
  };

  const renderFields = () => {
    return fields.map((item: any, index: any) => {
      let { type, style } = item;
      if (type == "select") {
        return (
          <div key={index} style={{ ...style }}>
            <Select clearable disabled={readonly} searchable={true} w={"100%"} mt={"md"} size="md" {...item} />
          </div>
        );
      } else {
        return (
          <div key={index} style={{ ...style }}>
            <TextInput disabled={readonly} w={"100%"} mt={"md"} size="md" {...item} />
          </div>
        );
      }
    });
  };

  const removeForm = (index: any) => {
    let dataObj = nestedData;
    dataObj?.splice(index, 1);
    allData.products.splice(index, 1);
    setNestedData([...dataObj]);
    allData.products = [...allData.products];
    setAllData({ ...allData });
  };

  let handleNestedFields = (val: any, key: any, index: any) => {
    if (allData.products[index]) {
      allData.products[index][key] = val;
    } else {
      allData.products[index] = { [key]: val };
    }
    allData.products = [...allData.products];
    setAllData({ ...allData });
  };

  const addButton = () => {
    if (readonly) {
      return <></>;
    }

    return (
      <div>
        <button
          className="btn btn-outline-success  d-flex align-items-center justify-content-center"
          onClick={() => {
            nestedData.push({});
            setNestedData([...nestedData]);
          }}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    );
  };

  const renderNestedInput = () => {
    if (!nestedData.length) {
      return addButton();
    }

    return (
      <>
        {nestedData.map((item: any, index: any) => {
          return (
            <div
              style={{ width: "100%", gap: 20 }}
              key={index}
              className="d-flex align-items-end justify-content-center  pb-3"
            >
              <Select
                clearable
                disabled={readonly}
                searchable
                data={products}
                name="SKU Name"
                style={{ width: "100%" }}
                label="SKU Name"
                value={allData.products[index]?.sku_name || ""}
                onChange={(e: any) => {
                  let data = findFromJson(products, e, "value");
                  handleNestedFields(data.producttype, "order_type", index);
                  handleNestedFields(data.amount, "rate", index);
                  handleNestedFields(e, "sku_name", index);
                }}
                placeholder="SKU Name"
                w={"100%"}
                size="md"
              />
              <TextInput
                disabled={readonly}
                name="Quantity"
                label="QTY"
                placeholder={"Quantity"}
                w={"35%"}
                value={allData.products[index]?.quantity || ""}
                onChange={(e: any) => {
                  let val = validatePhone(e.target.value);
                  handleNestedFields(val, "quantity", index);
                }}
                size="md"
              />
              <TextInput
                disabled={readonly}
                value={allData.products[index]?.rate || ""}
                onChange={(e: any) => {
                  let val = validatePhone(e.target.value);
                  handleNestedFields(val, "rate", index);
                }}
                name="Rate"
                label={"Rate"}
                placeholder={"Rate"}
                w={"40%"}
                size="md"
              />
              <TextInput
                disabled={true}
                // disabled={readonly}
                value={
                  calculateNumbers(
                    allData.products[index]?.rate,
                    allData.products[index]?.quantity,
                    true,
                    "amount",
                    allData.products[index]
                  ) ||
                  allData.products[index]?.amount ||
                  ""
                }
                onChange={(e: any) => {
                  let val = validatePhone(e.target.value);
                  handleNestedFields(val, "amount", index);
                }}
                name="Amount"
                label={"Amount"}
                placeholder={"Amount"}
                w={"40%"}
                size="md"
              />
              {!readonly ? (
                <div className="d-flex gap-3 w-50">
                  {nestedData.length > 1 ? (
                    <div>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                        onClick={() => removeForm(index)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ) : (
                    <div> </div>
                  )}
                  {index == nestedData.length - 1 ? addButton() : <div> </div>}
                </div>
              ) : (
                <div> </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  let locationData = useFinduserGeoLocationQuery("");
  locationData = iterateData(locationData);

  let validateData = (allData: any, keys: any[]) => {
    let isvalid = true;
    keys.map((item) => {
      if (!allData[item] || allData[item].trim().length < 1) {
        isvalid = false;
      }
    });
    return isvalid;
  };

  const saveData = () => {
    let amount = calculateData("amount");

    let validate = ["city", "state"];
    // if (!validateData(allData, validate)) {
    //   alert("Please fill all mandatory fields");
    //   return;
    // }

    if (amount > 50000) {
      if (!allData["eway_bill_no"] || allData["eway_bill_no"].trim().length < 2) {
        alert("eWay Bill Number is required");
        return;
      }
    }

    let dataArr: any = [];

    let objData = {
      units: 1,
      weight: 11,
      length: 40,
      height: 30,
      width: 30,
      display_in: "cm",
    };

    for (let index = 0; index < allData.boxes; index++) {
      objData.weight = allData.packaging_unit_details.weight;
      objData.length = allData.packaging_unit_details.length;
      objData.height = allData.packaging_unit_details.height;
      objData.width = allData.packaging_unit_details.width;

      dataArr.push(objData);
    }

    let data = {
      packaging_unit_details: dataArr,
      country: countryName,
      receiver_type: allData?.childSchoolData?.label,
      receiver_name: allData.receiver_name,
      city: allData.city_id,
      state: allData.state_id,
      // dispatch_date: allData.dispatch_date,
      eway_bill_no: allData["eway_bill_no"] || "",
      approx_weight: allData.approx_weight,
      actual_weight: allData.actual_weight,
      boxes: allData.boxes,
      weight_per_box: allData.weight_per_box,
      packed_by: allData.packed_by,
      checked_by: allData.checked_by,
      status: allData.status,
      products: allData.products,
      awb_number: allData.awb_number,
      receipt_number: "",
      invoice_number: "",
      // delivery_date: allData.delivery_date,
      amount: amount,
      warehouse_name: allData.warehouse_name,
      currency: locationData?.currency || "",
      registration_number: allData[allData?.childSchoolData?.key] || "",
    };

    dispatchRequest(data)
      .then(async (res) => {
        const users = await formTypeToFetcherMapper(formType)();
        setData(users);
        notifications.show({
          title: `Dispatch request Created`,
          message: ``,
          color: "blue",
          autoClose: 8000,
        });
        close();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDataRes = () => {
    let amount = calculateData("amount");

    let dataArr: any = [];

    let objData = {
      units: 1,
      weight: 11,
      length: 40,
      height: 30,
      width: 30,
      display_in: "cm",
    };

    for (let index = 0; index < allData.boxes; index++) {
      objData.weight = allData.packaging_unit_details.weight;
      objData.length = allData.packaging_unit_details.length;
      objData.height = allData.packaging_unit_details.height;
      objData.width = allData.packaging_unit_details.width;
      dataArr.push(objData);
    }

    let validate = ["city", "state"];
    // if (!validateData(allData, validate)) {
    //   alert("Please fill all mandatory fields");
    //   return;
    // }

    if (amount > 50000) {
      if (!allData["eway_bill_no"] || allData["eway_bill_no"].trim().length < 2) {
        alert("eWay Bill Number is required");
        return;
      }
    }

    let dataToUpdate = {
      packaging_unit_details: dataArr,
      country: countryName,
      receiver_type: allData?.childSchoolData?.label,
      receiver_name: allData.receiver_name,
      city: allData.city_id,
      state: allData.state_id,
      // dispatch_date: allData.dispatch_date,
      eway_bill_no: allData["eway_bill_no"] || "",
      approx_weight: allData.approx_weight,
      actual_weight: allData.actual_weight,
      boxes: allData.boxes,
      weight_per_box: allData.weight_per_box,
      packed_by: allData.packed_by,
      checked_by: allData.checked_by,
      status: allData.status,
      products: allData.products,
      awb_number: allData.awb_number,
      receipt_number: "",
      invoice_number: "",
      // delivery_date: allData.delivery_date,
      amount: amount,
      warehouse_name: allData.warehouse_name,
      currency: locationData?.currency || "",
      registration_number: allData[allData?.childSchoolData?.key] || "",
    };

    let data = {
      collection_name: "payments",
      op_name: "update",
      update_var: { ...dataToUpdate },
      filter_var: {
        _id: allData._id,
      },
    };

    readPayments(undefined, undefined, data)
      .then(async (res) => {
        const users = await formTypeToFetcherMapper(formType)();
        setData(users);
        notifications.show({
          title: `Dispatch request updated successfully`,
          message: ``,
          color: "blue",
          autoClose: 8000,
        });
        close();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="m-4 pb-4">
      <div className="d-flex flex-wrap gap-4">{renderData()}</div>
      <div className="border border-secondary my-4 rounded py-4 ps-4">{renderNestedInput()}</div>
      <div className="d-flex flex-wrap gap-4">
        {renderFields()}

        {!readonly && (
          <button
            className="btn btn-primary form-control w-100"
            onClick={() => {
              isUpdate ? updateDataRes() : saveData();
            }}
          >
            Save
          </button>
        )}
      </div>
      <Loader show={loader} />
    </div>
  );
}

export default DispatchForm;
