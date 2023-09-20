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

export const formTypeToTableMapper = (formType: FormType) => {
  const mapper: any = {
    Students: "users",
    Teachers: "users",
    "Relationship Managers": "users",
    "Super Admins": "users",
    Admins: "users",
    Country: "countries",
    State: "states",
    City: "cities",
    Competition: "competitions",
    // Annoucements: 'annoucements',
    Board: "boards",
    School: "schools",
    Class: "classes",
    "Exam Center": "exam_centers",
    "Exam Center Mappings": "exam_center_mapping",
    Subjects: "subjects",
    SMTPConfigs: "smtp_configs",
    SMSConfigs: "sms_configs",
    OrderConfigs: "order_configs",
    SiteConfigs: "site_configs",
    Templates: "templates",
    Products: "products",
    Payments: "payments",
    ProductCategory: "product_types",
  };
  return mapper[formType];
};
