import { MatrixRowType } from "@/components/Matrix";

export type RequestBodyType = {
  [key: string]: RequestBodyType | string | number | boolean | MatrixRowType | ProductsType[] | { _id: number };
};

export type GeographicalInformationType = {
  country_code: string;
  country_name: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  ip: string;
  state: string;
  region: string;
  region_code: string;
  country: string;
  timezone: string;
};

export type CountryType = {
  _id: string;
  name: string;
  Capital: string;
  "ISD Code": string;
  "ISO Alpha-3 Code": string;
  "ISO Alpha-2 Code": string;
  "Currency Name": string;
  "Currency Short Name": string;
  "Currency Symbol": string;
};

export type StateType = {
  _id: string;
  name: string;
  country_id: string;
  country: string;
};

export type CityType = {
  _id: string;
  name: string;
  state: string;
  country: string;
};

export type BoardType = {
  _id: string;
  name: string;
  code: string;
};

export type SchoolType = {
  _id: string;
  name: string;
  board: string;
  group: string;
  type: string;
  tags: string;
  code: string;
  city: string;
  address: string;
  pincode: string;
  label: string;
  geo_address: string;
  contact_number: string;
  contact_email: string;
};

export type ClassType = {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  roman_code: string;
  order_code: string;
};

export type CompetitionType = {
  _id: string;
  name: string;
  subject_id: string;
  parent_competition_id: string;
  country_id: string;
  code: string;
  tags: string;
  mode_id: string;
  message: string;
  status_id: string;
};
export type AnnoucementType = {
  country: string;
  created_at: string;
  enddate: string;
  name: string;
  status: boolean;
  whatsnew: string;
  _id: string;
  capital: string;
};

export type Testimonials = {
  name: string;
  school: string;
  description: string;
  country: string;
  startdate: string;
  enddate: string;
  thumbnail: string;
  _id: string;
};
export type StudentType = {
  _id: string;
  student_name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  email_1: string;
  email_2: string;
  mobile_1: string;
  mobile_2: string;
  dob: string;
  gender: string;
  school_name: string;
  section: string;
  class_id: string;
  competition: string;
};

export type StudentCreateType = {
  student_name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  email_1: string;
  email_2: string;
  mobile_1: string;
  mobile_2: string;
  dob: string;
  gender: string;
};

export type ExamCenterType = {
  _id: string;
  name: string;
  examdate: string;
  time: string;
  result_date: string;
  verification_start_date: string;
  verification_end_date: string;
  paper_code: string;
  mode: string;
  competition: string;
};

export type ExamCenterMappingType = {
  _id: string;
  registration_number: string;
  seat_number: string;
  exam_center_code: string;
  competition_code: string;
  class_code: string;
  status: boolean;
};

export type UserType = {
  _id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  email_1: string;
  email_2: string;
  "mobile,_no_1": string;
  mobile_no_2: string;
  status: boolean;
  is_verified: boolean;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  gender: string;
  school_name: string;
  section: string;
  class_id: string;
  competition: string;
  exam_center_code: string;
  seat_number: string;
  consented: boolean;
  class_id_number: string;
  class_code: string;
  competition_code: string;
  exam_center_id: string;
  country_code: string;
  cohort_code?: any;
  group_code?: any;
};

export type PaymentResponseType = {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null;
  status: string;
  attempts: number;
  notes: string[];
  created_at: number;
};

export type SMTPConfigType = {
  country: string;
  created_at: string;
  from_email: string;
  is_default: string;
  name: string;
  send_protocol: string;
  smtp_host: string;
  smtp_password: string;
  smtp_port: string;
  smtp_user: string;
  status: boolean;
  _id: string;
};

export type SiteConfigType = {
  country: string;
  created_at: string;
  name: string;
  status: boolean;
  _id: string;
  logo: string;
  defaultrows: number;
  googleanalyticscode: string;
  contactnumber: string;
  address: string;
  pannumber: string;
  gstnumber: string;
};

export type SMSConfigType = {
  _id: string;
  name: string;
  smpphost: string;
  username: string;
  password: string;
  country: string;
  status: boolean;
  created_at: string;
};

export type TemplatesType = {
  _id: string;
  name: string;
  country: string;
  status: boolean;
  created_at: string;
  shortname: string;
  templatetype: string;
  content: string;
  subject: string;
};

export type Cohort_Types = {
  name: string;
  code: string;
  context: string;
  status: any;
};

export type OrderConfigsType = {
  _id: string;
  name: string;
  country: string;
  status: boolean;
  created_at: string;
  orderstartingno: string;
  invoicestartingno: string;
  paymentsuccessfulmsg: string;
  paymentpendingmsg: string;
  paymentdeclinedmsg: string;
  discountsuccessmsg: string;
  discounterrmsg: string;
};

export type ProductsType = {
  _id: string;
  name: string;
  producttype: string;
  country: string;
  amount: string;
  qty: string;
  imageurl: string;
  displayonfront: boolean;
  board: string;
  class: string;
  hsncode: string;
  displayonaccount: boolean;
  status: boolean;
  created_at: string;
  bundle: boolean;
  updated_at: string;
  shipping_cost: number;
  shipping_tax: number;
  base_cost: number;
  tax_amount: number;
  total_cost: number;
  products: ProductsType[];
};

export type PaymentsType = {
  _id: string;
  order_id: string;
  receipt_number: string;
  amount: string;
  currency: string;
  status: boolean;
  created_at: string;
  country: string;
};

export type ProductCategoryType = {
  _id: string;
  name: string;
  code: string;
  country: string;
  taxname: string;
  taxpercent: string;
  status: boolean;
  created_at: string;
};

export type ContactUSType = {
  name: string;
  email: string;
  mobileNumber: string;
  subject: string;
  city: string;
  message: string;
  answer: string;
};
