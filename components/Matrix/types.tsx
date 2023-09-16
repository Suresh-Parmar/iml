import {
  CountryType,
  StateType,
  CityType,
  BoardType,
  SchoolType,
  StudentType,
  UserType,
  CompetitionType,
  StudentCreateType,
  ExamCenterType,
  ExamCenterMappingType,
  ClassType,
  SMTPConfigType,
  SMSConfigType,
  SiteConfigType,
  TemplatesType,
  OrderConfigsType,
  ProductsType,
  PaymentsType,
  ProductCategoryType,
  ContactUSType,
  AnnoucementType,
  Testimonials,
  Cohort_Types,
} from "@/utilities/api-types";

type MatrixRowType = CountryType &
  StateType &
  CityType &
  BoardType &
  SchoolType &
  ClassType &
  StudentType &
  UserType &
  CompetitionType &
  StudentCreateType &
  ExamCenterType &
  ExamCenterMappingType &
  SMTPConfigType &
  SMSConfigType &
  SiteConfigType &
  TemplatesType &
  OrderConfigsType &
  ProductsType &
  PaymentsType &
  ProductCategoryType &
  AnnoucementType &
  Testimonials &
  ContactUSType &
  Cohort_Types;

type MatrixDataType = Array<MatrixRowType>;

export type { MatrixRowType, MatrixDataType };

export type FormType =
  | "Country"
  | "State"
  | "City"
  | "Competition"
  | "Board"
  | "Class"
  | "School"
  | "Subjects"
  | "Exam Center"
  | "Exam Center Mappings"
  | "Students"
  | "Teachers"
  | "Relationship Managers"
  | "Super Admins"
  | "Admins"
  | "SMTPConfigs"
  | "SMSConfigs"
  | "OrderConfigs"
  | "SiteConfigs"
  | "Templates"
  | "Products"
  | "Payments"
  | "testimonials"
  | "announcements"
  | "ProductCategory";

export type UsersType = "Students" | "Teachers" | "Relationship Managers" | "Super Admins" | "Admins";

export const UsersTypes = ["Students", "Teachers", "Relationship Managers", "Super Admins", "Admins"];
