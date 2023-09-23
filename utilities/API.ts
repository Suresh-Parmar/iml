import { MatrixDataType, MatrixRowType } from "@/components/Matrix";
import axios from "axios";

import { GeographicalInformationType, RequestBodyType, PaymentResponseType, ContactUSType } from "./api-types";
import { dispatchSignoutThunk, getReduxState } from "@/redux/hooks";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const NEXT_API = `${BASE_URL}/crud_ops`;
export const SPREADSHEET_UPLOAD_API = `${BASE_URL}/upload_excel`;
export const SPREADSHEET_UPLOAD_API_STUDENT = `${BASE_URL}/student_creation_excel`;
export const SPREADSHEET_UPDATE_API_STUDENT = `${BASE_URL}/student_update_excel`;
export const SPREADSHEET_UPDATE_API = `${BASE_URL}/update_masters`;
export const STUDENT_NEXT_API = `${BASE_URL}/student_panel`;
export const OTHER_USER_CREATION = `${BASE_URL}/other_user_creation`;
export const STUDENT_SIGNUP_NEXT_API = `${BASE_URL}/student_signup`;
export const PAYMENTS_NEXT_API = `${BASE_URL}/payment_request`;
export const LANDING_API = `${BASE_URL}/landing_page_data`;
export const PAYMENT_VERIFY_API = `${BASE_URL}/verify_payment`;
export const EXPORT_TEMPLATE = `${BASE_URL}/export_template`;
export const FORGOT_CREDS = `${BASE_URL}/forgot_creds`;

const getAPIHeaders = (extraHeaders: Record<string, string> = {}) => {
  // grab current state
  const state = getReduxState();
  // get the JWT token out of it
  const authToken = state?.authentication?.metadata?.token;
  return {
    Authorization: `Bearer ${authToken}`,
    ...extraHeaders,
  };
};

const getSelectedCountry = () => {
  const state = getReduxState();
  return state.client.selectedCountry.name;
};

async function getGeographicalInformation() {
  try {
    const response = await axios.get("https://ipapi.co/json");
    const responseJSON = (await response.data) as GeographicalInformationType;
    return responseJSON;
  } catch (err) {
    return {
      country_code: "",
      country_name: "",
      city: "",
      postal: "",
      latitude: 0,
      longitude: 0,
      ip: "",
      state: "",
      region: "",
      region_code: "",
      country: "",
      timezone: "",
    } as GeographicalInformationType;
  }
}

export const readDataCustomFilter = async (
  tableName: string,
  operationType: "find" | "find_many",
  filters: Record<string, any>
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: `${operationType}`,
  };

  if (Object.keys(filters).length) {
    requestBody["filter_var"] = {
      ...filters,
    };
  }

  try {
    const response = await axios.post(`${NEXT_API}`, requestBody, {
      headers: getAPIHeaders(),
    });

    const responseJSON: MatrixDataType = await response.data["response"];
    return responseJSON;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      dispatchSignoutThunk();
    }
  }
  return [];
};

export const readData = async (
  tableName: string,
  operationType: "find" | "find_many",
  filterBy?: "name" | "country_id" | "state" | "city" | "status" | "role" | "country" | "subject_id" | "class",
  filterQuery?: string | number | boolean,
  data?: any
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: `${operationType}`,
  };
  const filterCountry = tableName !== "countries";

  if (filterBy && filterQuery) {
    requestBody["filter_var"] = {
      [filterBy]: filterQuery,
    };
  }

  if (filterCountry) {
    const existingFilters: any = requestBody?.["filter_var"] ?? {};
    requestBody["filter_var"] = {
      ...existingFilters,
      country: getSelectedCountry(),
    };
  }

  if (data) {
    requestBody = data;
  }
  try {
    const response = await axios.post(`${NEXT_API}`, requestBody, {
      headers: getAPIHeaders(),
    });

    const responseJSON: MatrixDataType = await response.data["response"];
    return responseJSON;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      dispatchSignoutThunk();
    }
  }
  return [];
};

const updateData = async (
  tableName: string,
  updateVars: RequestBodyType,
  filterBy?: "_id" | "name" | "country_id" | "state" | "city" | "status",
  filterQuery?: string | number | boolean
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: "update",
    update_var: updateVars,
  };
  if (filterBy && filterQuery) {
    requestBody["filter_var"] = {
      [filterBy]: filterQuery,
    };
  }
  const response = await axios.post(`${NEXT_API}`, requestBody, {
    headers: getAPIHeaders(),
  });
  const responseJSON: string = await response.data["response"];
  return responseJSON;
};

const updateDataRes = async (
  tableName: any,
  updateBody: any,
  filterBy: any = "_id",
  filterQuery: any,
  op_name: any = "update"
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name,
  };

  if (updateBody) {
    if (op_name == "update") {
      requestBody.update_var = updateBody;
    } else {
      requestBody.new_var = updateBody;
    }
  }

  if (filterBy && filterQuery) {
    requestBody["filter_var"] = {
      [filterBy]: filterQuery,
    };
  }
  return await axios.post(`${NEXT_API}`, requestBody, {
    headers: getAPIHeaders(),
  });
};

export const readLandingData = async (
  tableName: string,
  operationType: "find" | "find_many",
  filterBy?: "name" | "country_id" | "state" | "city" | "status" | "role" | "country" | "class",
  filterQuery?: string | number | boolean
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: `${operationType}`,
  };
  const filterCountry = tableName !== "countries";

  if (filterBy && filterQuery) {
    requestBody["filter_var"] = {
      [filterBy]: filterQuery,
    };
  }

  if (filterCountry) {
    const existingFilters: any = requestBody?.["filter_var"] ?? {};

    let countryVal = getSelectedCountry();

    requestBody["filter_var"] = {
      ...existingFilters,
      country: countryVal ? countryVal : "India",
    };
  }
  try {
    const response = await axios.post(`${LANDING_API}`, requestBody, {
      headers: getAPIHeaders(),
    });

    const responseJSON: MatrixDataType = await response.data["response"];
    return responseJSON;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      dispatchSignoutThunk();
    }
  }
  return [];
};

export const LandingForms = async (
  tableName: string,
  values: RequestBodyType,
  filterBy?: "name" | "country_id" | "state" | "city" | "status" | "role" | "country" | "class",
  filterQuery?: string | number | boolean
) => {
  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: `create`,
    new_var: values,
  };

  if (filterBy && filterQuery) {
    requestBody["filter_var"] = {
      [filterBy]: filterQuery,
    };
  }
  try {
    const response = await axios.post(`${BASE_URL}/Writedata`, requestBody, {
      headers: getAPIHeaders(),
    });

    const responseJSON: string = await response.data["response"];
    return responseJSON;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      dispatchSignoutThunk();
    }
  }
  return [];
};

const forgotCreds = async (data: any, useToken: any = false) => {
  if (useToken) {
    await axios.post(FORGOT_CREDS, data, { headers: getAPIHeaders() });
  } else {
    await axios.post(FORGOT_CREDS, data);
  }
};

const createData = async (tableName: string, operationType: "create", payload: MatrixRowType) => {
  const filterCountry = tableName !== "countries";
  let newPayload = { ...payload };

  if (filterCountry) {
    newPayload = {
      ...payload,
      country: getSelectedCountry(),
    };
  }

  let requestBody: RequestBodyType = {
    collection_name: `${tableName}`,
    op_name: `${operationType}`,
    new_var: newPayload,
  };

  const response = await axios.post(`${NEXT_API}`, requestBody, {
    headers: getAPIHeaders(),
  });

  const responseJSON: string = await response.data["response"];
  return responseJSON;
};

const createContactUs = async (values: RequestBodyType) => {
  let contact = await LandingForms("contactus", values);
  return contact;
};

const createCordinator = async (values: RequestBodyType) => {
  let cordinator = await LandingForms("joinuscoordinator", values);
  return cordinator;
};

const createRegisteration = async (values: RequestBodyType) => {
  let register = await LandingForms("referyourschool", values);
  return register;
};

const readCountries = async (filterBy?: "name" | "status", filterQuery?: string | number | boolean) => {
  let countries: MatrixDataType;
  if (filterBy && filterQuery) {
    countries = await readData("countries", "find_many", filterBy, filterQuery);
  } else {
    countries = await readData("countries", "find_many");
  }
  return countries;
};

const readCountriesOnLandingPage = async (filterBy?: "name" | "status", filterQuery?: string | number | boolean) => {
  let countries: MatrixDataType;
  if (filterBy && filterQuery) {
    countries = await readLandingData("countries", "find_many", filterBy, filterQuery);
  } else {
    countries = await readLandingData("countries", "find_many");
  }
  return countries;
};

const readCountriesWithFlags = async () => {
  const countries = await readCountries("status", true);
  const countriesWithFlags = countries.map((country) => {
    return {
      value: country["ISO Alpha-2 Code"],
      label: country.name,
    };
    // return `${country.name}`
  });
  return countriesWithFlags;
};

const readCountriesLandingWithFlags = async () => {
  const countries = await readCountriesOnLandingPage("status", true);
  const countriesWithFlags = countries.map((country) => {
    return {
      value: country["ISO Alpha-2 Code"],
      label: country.name,
    };
    // return `${country.name}`
  });
  return countriesWithFlags;
};

const readStates = async (filterBy?: "country", filterQuery?: string | number) => {
  let states: MatrixDataType;
  if (filterBy && filterQuery) {
    states = await readData("states", "find_many", filterBy, filterQuery);
  } else {
    states = await readData("states", "find_many");
  }
  return states;
};

const readCities = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  let cities: MatrixDataType;
  if (filterBy && filterQuery) {
    cities = await readData("cities", "find_many", filterBy, filterQuery);
  } else {
    cities = await readData("cities", "find_many");
  }
  return cities;
};

const readBoards = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  const boards = await readData("boards", "find_many");
  return boards;
};

const readSchools = async (filterBy?: "name" | "city", filterQuery?: string | number, customFIlters?: any) => {
  let schools: MatrixDataType;
  if (filterBy && filterQuery) {
    schools = await readData("schools", "find_many", filterBy, filterQuery, customFIlters);
  } else {
    schools = await readData("schools", "find_many");
  }
  return schools;
};

const readClasses = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  const classes = await readData("classes", "find_many");
  return classes;
};

const readCompetitions = async (filterBy?: "subject_id" | "status", filterQuery?: string | boolean) => {
  let competitions: MatrixDataType;
  if (filterBy && filterQuery) {
    competitions = await readData("competitions", "find_many", filterBy, filterQuery);
  } else {
    competitions = await readData("competitions", "find_many");
  }

  return competitions;
};

const readAnnoucementsAdmin = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  const annoucements = await readData("annoucements", "find_many");
  return annoucements;
};

const readExamCenters = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  const examCenters = await readData("exam_centers", "find_many");
  return examCenters;
};

const readExamCentersMapping = async (filterBy?: "name" | "state", filterQuery?: string | number) => {
  const examCentersMapping = await readData("exam_center_mapping", "find_many");
  return examCentersMapping;
};

const readStudents = async () => {
  const students = await readData("users", "find_many", "role", "student");
  return students;
};

const readSuperAdmins = async () => {
  const students = await readData("users", "find_many", "role", "super_admin");
  return students;
};

const readAdmins = async () => {
  const students = await readData("users", "find_many", "role", "admin");
  return students;
};

const readRelationshipManagers = async () => {
  const students = await readData("users", "find_many", "role", "rm");
  return students;
};

const readTeachers = async (data?: any) => {
  const students = await readData("users", "find_many", "role", "teacher", data);
  return students;
};

const readUsers = async () => {
  const users = await readData("users", "find_many");
  return users;
};

const readSubjects = () => {
  return readData("subjects", "find_many");
};

const readTestimonial = async () => {
  let testimonial: MatrixDataType;
  testimonial = await readLandingData("testimonials", "find_many");
  return testimonial;
};

const readAnnoucements = async () => {
  let annoucement = await readLandingData("announcements", "find_many");
  return annoucement;
};

const readApiData = async (collection: any) => {
  let apiData = await readData(collection, "find_many");
  return apiData;
};

const readCompetitionsLanding = async () => {
  let competitions = await readLandingData("competitions", "find_many");
  return competitions;
};

export const readClassesLanding = async () => {
  return await readLandingData("classes", "find_many");
};

export const readProductsLanding = async (className: string, boardName: string) => {
  let requestBody: RequestBodyType = {
    collection_name: "products",
    op_name: "find_many",
  };
  let countryVal = getSelectedCountry();

  requestBody["filter_var"] = {
    class: className,
    board: boardName,
    country: countryVal || "India",
  };

  try {
    const response = await axios.post(`${LANDING_API}`, requestBody, {
      headers: getAPIHeaders(),
    });

    const responseJSON: MatrixDataType = await response.data["response"];
    return responseJSON;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      dispatchSignoutThunk();
    }
  }
  return [];
};

export const readBoardsLanding = async () => {
  return await readLandingData("boards", "find_many");
};

export const readSMTPConfigs = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let smtpConfigs: MatrixDataType;
  if (filterBy && filterQuery) {
    smtpConfigs = await readData("smtp_configs", "find_many", filterBy, filterQuery);
  } else {
    smtpConfigs = await readData("smtp_configs", "find_many");
  }
  return smtpConfigs;
};

export const readSiteConfigs = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let smtpConfigs: MatrixDataType;
  if (filterBy && filterQuery) {
    smtpConfigs = await readData("site_configs", "find_many", filterBy, filterQuery);
  } else {
    smtpConfigs = await readData("site_configs", "find_many");
  }
  return smtpConfigs;
};
export const readOrderConfigs = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let smtpConfigs: MatrixDataType;
  if (filterBy && filterQuery) {
    smtpConfigs = await readData("order_configs", "find_many", filterBy, filterQuery);
  } else {
    smtpConfigs = await readData("order_configs", "find_many");
  }
  return smtpConfigs;
};

export const readTempates = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let templates: MatrixDataType;
  if (filterBy && filterQuery) {
    templates = await readData("templates", "find_many", filterBy, filterQuery);
  } else {
    templates = await readData("templates", "find_many");
  }
  return templates;
};

export const readPayments = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let payments: MatrixDataType;
  if (filterBy && filterQuery) {
    payments = await readData("payments", "find_many", filterBy, filterQuery);
  } else {
    payments = await readData("payments", "find_many");
  }
  return payments;
};

export const readProductCategories = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let productCategories: MatrixDataType;
  if (filterBy && filterQuery) {
    productCategories = await readData("product_types", "find_many", filterBy, filterQuery);
  } else {
    productCategories = await readData("product_types", "find_many");
  }
  return productCategories;
};

export const readProducts = async (filterBy?: "country_id" | "class", filterQuery?: string | number) => {
  let products: MatrixDataType;
  if (filterBy && filterQuery) {
    products = await readData("products", "find_many", filterBy, filterQuery);
  } else {
    products = await readData("products", "find_many");
  }
  return products;
};

export const readSMSConfigs = async (filterBy?: "country_id", filterQuery?: string | number) => {
  let smtpConfigs: MatrixDataType;
  if (filterBy && filterQuery) {
    smtpConfigs = await readData("sms_configs", "find_many", filterBy, filterQuery);
  } else {
    smtpConfigs = await readData("sms_configs", "find_many");
  }
  return smtpConfigs;
};

const updateUser = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("users", updateBody, "_id", primaryKey);
  return updateStatus;
};

const dynamicDataUpdate = async (type: any, primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData(type, updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateBoard = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("boards", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateClass = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("classes", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateSubject = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("subjects", updateBody, "_id", primaryKey);
  return updateStatus;
};

export const updateSMTPConfig = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("smtp_configs", updateBody, "_id", primaryKey);
  return updateStatus;
};

export const updateOrderConfig = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("order_configs", updateBody, "_id", primaryKey);
  return updateStatus;
};

export const updateTemplate = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("templates", updateBody, "_id", primaryKey);
  return updateStatus;
};

export const updateSiteConfig = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("site_configs", updateBody, "_id", primaryKey);
  return updateStatus;
};

export const updateSMSConfig = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("sms_configs", updateBody, "_id", primaryKey);
  return updateStatus;
};
export const updateProduct = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("products", updateBody, "_id", primaryKey);
  return updateStatus;
};
export const updateProductType = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("product_types", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateCompetition = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("competitions", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateAnnoucements = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("annoucements", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateExamCenter = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("exam_centers", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateExamCenterMapping = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("exam_center_mapping", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateSchool = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("schools", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateCity = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("cities", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateState = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("states", updateBody, "_id", primaryKey);
  return updateStatus;
};

const updateCountry = async (primaryKey: string, updateBody: RequestBodyType) => {
  const updateStatus = await updateData("countries", updateBody, "_id", primaryKey);
  return updateStatus;
};

const createOtherUsers = async (payload: MatrixRowType) => {
  const response = await axios.post(
    `${OTHER_USER_CREATION}`,
    {
      ...payload,
      country: getSelectedCountry(),
    },
    {
      headers: getAPIHeaders(),
    }
  );
  return response;
};

const createStudent = async (payload: MatrixRowType) => {
  const response = await axios.post(
    `${STUDENT_NEXT_API}`,
    {
      ...payload,
      country: getSelectedCountry(),
    },
    {
      headers: getAPIHeaders(),
    }
  );
  return response;
};

const createStudentSignUp = (payload: MatrixRowType) => {
  return axios.post(
    `${STUDENT_SIGNUP_NEXT_API}`,
    {
      ...payload,
      country: getSelectedCountry(),
    },
    {
      headers: getAPIHeaders(),
    }
  );
};

const createState = async (payload: MatrixRowType) => {
  const creationStatus = await createData("states", "create", payload);
  return creationStatus;
};

const createCity = async (payload: MatrixRowType) => {
  const creationStatus = await createData("cities", "create", payload);
  return creationStatus;
};

const createCountry = async (payload: MatrixRowType) => {
  const creationStatus = await createData("countries", "create", payload);
  return creationStatus;
};

const createSchool = async (payload: MatrixRowType) => {
  const schoolCreationStatus = await createData("schools", "create", payload);
  return schoolCreationStatus;
};

const createBoard = async (payload: MatrixRowType) => {
  const creationStatus = await createData("boards", "create", payload);
  return creationStatus;
};

const dynamicCreate = async (type: string, payload: MatrixRowType) => {
  const creationStatus = await createData(type, "create", payload);
  return creationStatus;
};

const createCompetition = async (payload: MatrixRowType) => {
  const newCompetition = await createData("competitions", "create", payload);
  return newCompetition;
};

const createAnnoucements = async (payload: MatrixRowType) => {
  const newAnnoucements = await createData("annoucements", "create", payload);
  return newAnnoucements;
};

const createClass = async (payload: MatrixRowType) => {
  const creationStatus = await createData("classes", "create", payload);
  return creationStatus;
};

const createSubject = async (payload: MatrixRowType) => {
  return createData("subjects", "create", payload);
  // return creationStatus;
};

export const createSMTP = async (payload: MatrixRowType) => {
  return createData("smtp_configs", "create", payload);
};

export const createOrderConfig = async (payload: MatrixRowType) => {
  return createData("order_configs", "create", payload);
};

export const createTemplates = async (payload: MatrixRowType) => {
  return createData("templates", "create", payload);
};

export const createSiteConfig = async (payload: MatrixRowType) => {
  return createData("site_configs", "create", payload);
};

export const createSMSConfig = async (payload: MatrixRowType) => {
  return createData("sms_configs", "create", payload);
};

export const createProduct = async (payload: MatrixRowType) => {
  return createData("products", "create", payload);
};

export const createProductType = async (payload: MatrixRowType) => {
  return createData("product_types", "create", payload);
};

const createExamCenter = async (payload: MatrixRowType) => {
  const schoolCreationStatus = await createData("exam_centers", "create", payload);
  return schoolCreationStatus;
};

const createExamCenterMapping = async (payload: MatrixRowType) => {
  const schoolCreationStatus = await createData("exam_centers", "create", payload);
  return schoolCreationStatus;
};

const deleteRow = async (table: string, id: string) => {
  const requestBody: {
    collection_name: string;
    op_name: string;
    filter_var: { _id: string };
    update_var: { status: boolean };
  } = {
    collection_name: `${table}`,
    op_name: `update`,
    filter_var: { _id: id },
    update_var: { status: false },
  };
  const response = await axios.post(`${NEXT_API}`, requestBody, {
    headers: getAPIHeaders(),
  });
  const responseJSON = await response.data["response"];
  return responseJSON;
};

const unDeleteRow = async (table: string, id: string) => {
  const requestBody: {
    collection_name: string;
    op_name: string;
    filter_var: { _id: string };
    update_var: { status: boolean };
  } = {
    collection_name: `${table}`,
    op_name: `update`,
    filter_var: { _id: id },
    update_var: { status: true },
  };
  const response = await axios.post(`${NEXT_API}`, requestBody, {
    headers: getAPIHeaders(),
  });
  const responseJSON = await response.data["response"];
  return responseJSON;
};

const uploadSpreadsheet = async (spreadsheetFile: File, tableName: string, meta_data: any) => {
  let formData = new FormData();
  formData.append("file", spreadsheetFile);
  formData.append("meta_data", meta_data);

  const response = await axios.post(`${SPREADSHEET_UPLOAD_API}`, formData, {
    headers: getAPIHeaders(),
  });

  const responseJSON = await response.data;
  return responseJSON;
};

const downloadSample = async (collection: object) => {
  let body = JSON.stringify(collection);

  const response = await axios.post(`${EXPORT_TEMPLATE}`, body, {
    headers: getAPIHeaders({}),
  });

  const responseJSON = await response.data;
  return responseJSON;
};

const uploadSpreadsheetStudent = async (spreadsheetFile: File, tableName: string, meta_data: any) => {
  let formData = new FormData();
  formData.append("file", spreadsheetFile);
  formData.append("meta_data", meta_data);

  const response = await axios.post(`${SPREADSHEET_UPLOAD_API_STUDENT}`, formData, {
    headers: getAPIHeaders(),
  });

  const responseJSON = await response.data;
  return responseJSON;
};

const updateSpreadsheet = async (spreadsheetFile: File, tableName: string, metadata: any) => {
  let formData = new FormData();
  formData.append("file", spreadsheetFile);
  formData.append("meta_data", metadata);
  const response = await axios.post(`${SPREADSHEET_UPDATE_API}`, formData, {
    headers: getAPIHeaders(),
  });
  const responseJSON = await response.data;
  return responseJSON;
};

const updateSpreadsheetStudent = async (spreadsheetFile: File, tableName: string, meta_data: any) => {
  let formData = new FormData();
  formData.append("file", spreadsheetFile);
  formData.append("meta_data", meta_data);
  const response = await axios.post(`${SPREADSHEET_UPDATE_API_STUDENT}`, formData, {
    headers: getAPIHeaders(),
  });
  const responseJSON = await response.data;
  return responseJSON;
};

function loadPaymentScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const createOrder = async (product_name: string, userName: any) => {
  const geoInfo = await getGeographicalInformation();
  const countryFromGeoInfo = geoInfo.country_name;
  let requestBody: RequestBodyType = {
    country: `${countryFromGeoInfo}`,
    product_name: product_name,
    registration_number: userName,
  };
  const response = await axios.post(`${PAYMENTS_NEXT_API}`, requestBody, {
    headers: {},
  });
  const responseJSON: PaymentResponseType = await response.data;
  return responseJSON;
};

export type VerifyPaymentData = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  product_name: any;
  invoiceBreakdown: any;
};

export const verifyPaymantData = async (body: VerifyPaymentData) => {
  const response = await axios.post(`${PAYMENT_VERIFY_API}`, JSON.stringify(body));
  const responseJSON: PaymentResponseType = await response.data;
  return responseJSON;
};

export {
  createOrder,
  loadPaymentScript,
  readAdmins,
  readSuperAdmins,
  readRelationshipManagers,
  readTeachers,
  uploadSpreadsheet,
  uploadSpreadsheetStudent,
  downloadSample,
  updateSpreadsheetStudent,
  updateSpreadsheet,
  createState,
  createCity,
  createCountry,
  createSchool,
  createBoard,
  createClass,
  createSubject,
  createExamCenter,
  createExamCenterMapping,
  createStudentSignUp,
  createOtherUsers,
  updateUser,
  deleteRow,
  unDeleteRow,
  readExamCentersMapping,
  readCountries,
  readCountriesWithFlags,
  readCountriesLandingWithFlags,
  readStates,
  readCities,
  readBoards,
  readSchools,
  readClasses,
  readCompetitions,
  readAnnoucementsAdmin,
  readStudents,
  readUsers,
  readSubjects,
  readTestimonial,
  readAnnoucements,
  createContactUs,
  createCordinator,
  createRegisteration,
  readCompetitionsLanding,
  getGeographicalInformation,
  createStudent,
  createCompetition,
  createAnnoucements,
  readExamCenters,
  updateBoard,
  updateCity,
  updateClass,
  updateSubject,
  updateCompetition,
  updateAnnoucements,
  updateCountry,
  updateExamCenter,
  updateExamCenterMapping,
  updateSchool,
  updateState,
  dynamicDataUpdate,
  dynamicCreate,
  forgotCreds,
  readApiData,
  updateDataRes,
};
