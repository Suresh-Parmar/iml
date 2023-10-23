import { fuzzySort } from "../Matrix/utilities";

export const allTypes: any = {
  Country: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Capital",
      key: "Capital",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "ISD Code",
      key: "ISD Code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "ISO Alpha-2 Code",
      key: "ISO Alpha-2 Code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "ISO Alpha-3 Code",
      key: "ISO Alpha-3 Code",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Currency Name",
      key: "Currency Name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Currency Short Name",
      key: "Currency Short Name",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Currency Symbol",
      key: "Currency Symbol",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Status",
      key: "status",
      defaultShow: false,
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  announcements: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Capital",
      key: "capital",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "What's New",
      key: "whatsnew",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "End Date",
      key: "enddate",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Role",
      key: "role",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  marks: [
    {
      id: "Registration No.",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Marks %",
      key: "percent",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Seat Number",
      key: "seatnumber",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Class",
      key: "class",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Series",
      key: "series",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Total Marks",
      key: "totalmarks",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Marks",
      key: "marks",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Updated By",
      key: "updated_by",
      defaultShow: false,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Rank",
      key: "rank",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Grade",
      key: "grade",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  testimonials: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "School",
      key: "school",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Description",
      key: "description",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Start Date",
      key: "startdate",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "End Date",
      key: "enddate",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Thumbnail",
      key: "thumbnail",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  State: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  City: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Competition: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Subject",
      key: "subject_id",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Parent Competition",
      key: "parent_competition_id",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country_id",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Tags",
      key: "tags",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Board: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Board Type",
      key: "board_type",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Class: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Roman Code",
      key: "roman_code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Order Code",
      key: "order_code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  School: [
    {
      id: "Code",
      key: "code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Class Label",
      key: "class_label",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Board",
      key: "board",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Group",
      key: "group",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Tags",
      key: "tags",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Address",
      key: "address",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "PinCode",
      key: "pincode",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Name Address",
      key: "name_address",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Geographic Address",
      key: "geo_address",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Contact Number",
      key: "contact_number",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Contact E-Mail",
      key: "contact_email",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Principal",
      key: "principal",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Teacher Incharge",
      key: "teacher_incharge",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Relationship Manager",
      key: "relationship_manager",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Name on Certificate",
      key: "name_certificate",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Affiliation",
      key: "affiliation",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Paid",
      key: "paid",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Language",
      key: "language",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Section",
      key: "section",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Comments",
      key: "comments",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  "Exam Center": [
    {
      id: "Center Code",
      key: "_id",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Competition",
      key: "competition",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Name",
      key: "name",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Mode",
      key: "mode",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Paper Code",
      key: "paper_code",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Address",
      key: "address",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "State",
      key: "state",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "City",
      key: "city",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Exam Date",
      key: "examdate",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Exam Time",
      key: "time",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Result Date",
      key: "result_date",
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Verification Start Date",
      key: "verification_start_date",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Verification End Date",
      key: "verification_end_date",

      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  "Exam Center Mappings": [
    {
      id: "Registration Number",
      key: "registration_number",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Seat Number",
      key: "seat_number",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Exam Center Code",
      key: "exam_center_code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Competition",
      key: "competition_code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Class",
      key: "class_code",
      defaultShow: true,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "Country",
      key: "country",
      defaultShow: false,
      filterFn: "equals",
      sortingFn: fuzzySort,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Subjects: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  SMTPConfigs: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Smtp Host",
      key: "smtp_host",
      defaultShow: true,
    },
    {
      id: "Smtp User",
      key: "smtp_user",
      defaultShow: true,
    },
    {
      id: "Smtp Password",
      key: "smtp_password",
    },
    {
      id: "Send Protocol",
      key: "send_protocol",
      defaultShow: true,
    },
    {
      id: "Smtp Port",
      key: "smtp_port",
      defaultShow: true,
    },
    {
      id: "From Email",
      key: "from_email",
      defaultShow: true,
    },
    {
      id: "Default",
      key: "is_default",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  SMSConfigs: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "SMPP Host",
      key: "smpphost",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  SiteConfigs: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Default Rows",
      key: "defaultrows",
      defaultShow: true,
    },
    {
      id: "GA Code",
      key: "googleanalyticscode",
      defaultShow: true,
    },
    {
      id: "Contact No.",
      key: "contactnumber",
      defaultShow: true,
    },
    {
      id: "Address",
      key: "address",
      defaultShow: true,
    },
    {
      id: "Pan",
      key: "pannumber",
      defaultShow: true,
    },
    {
      id: "GST No.",
      key: "gstnumber",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  OrderConfigs: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Order Starting No",
      key: "orderstartingno",
      defaultShow: true,
    },
    {
      id: "Invoice Starting No",
      key: "invoicestartingno",
      defaultShow: true,
    },
    {
      id: "Payment Successful Msg",
      key: "paymentsuccessfulmsg",
      defaultShow: true,
    },
    {
      id: "Payment Pending Msg",
      key: "paymentpendingmsg",
      defaultShow: true,
    },
    {
      id: "Payment Declined Msg",
      key: "paymentdeclinedmsg",
      defaultShow: true,
    },
    {
      id: "Payment Success Msg",
      key: "discountsuccessmsg",
      defaultShow: true,
    },
    {
      id: "Discount Counter Msg",
      key: "discounterrmsg",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Templates: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Short Name",
      key: "shortname",
      defaultShow: true,
    },
    {
      id: "Template Type",
      key: "templatetype",
      defaultShow: true,
    },
    {
      id: "Subject",
      key: "subject",
      defaultShow: true,
    },
    {
      id: "Content",
      key: "content",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Payments: [
    {
      id: "Order ID",
      key: "order_id",
      defaultShow: true,
    },
    {
      id: "Receipt Number",
      key: "receipt_number",
      defaultShow: true,
    },
    {
      id: "Invoice Number",
      key: "invoice_number",
      defaultShow: true,
    },
    {
      id: "Amount",
      key: "amount",
      defaultShow: true,
    },
    {
      id: "Currency",
      key: "currency",
      defaultShow: true,
    },
    {
      id: "Created At",
      key: "created_at",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
      defaultShow: true,
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Dispatch: [
    {
      id: "RazorPayOrderID",
      key: "order_id",
      defaultShow: false,
    },
    {
      id: "Dispatch ID",
      key: "dispatch_id",
      defaultShow: true,
    },
    {
      id: "Order ID",
      key: "receipt_number",
      defaultShow: true,
    },
    {
      id: "Receiver Type",
      key: "receiver_type",
      defaultShow: true,
    },
    {
      id: "Receiver Name",
      key: "receiver_name",
      defaultShow: true,
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "Invoice No",
      key: "invoice_number",
      defaultShow: true,
    },
    {
      id: "Dispatch Date",
      key: "dispatch_date",
      defaultShow: true,
    },
    {
      id: "Courier Name",
      key: "warehouse_name",
      defaultShow: true,
    },
    {
      id: "Warehouse Name",
      key: "warehouse_name",
      defaultShow: false,
    },
    {
      id: "AWB No",
      key: "awb_number",
      defaultShow: true,
    },
    {
      id: "Status",
      key: "status",
      defaultShow: true,
    },

    {
      id: "EWay Bill No",
      key: "eway_bill_no",
      defaultShow: false,
    },
    {
      id: "Actual Weight",
      key: "actual_weight",
      defaultShow: false,
    },
    {
      id: "No Of Boxes",
      key: "boxes",
      defaultShow: false,
    },
    {
      id: "Packed By",
      key: "packed_by",
      defaultShow: false,
    },
    {
      id: "Checked By",
      key: "checked_by",
      defaultShow: false,
    },
    {
      id: "Amount",
      key: "amount",
      defaultShow: false,
    },
    {
      id: "Created At",
      key: "created_at",
      defaultShow: true,
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Products: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Title",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Description",
      key: "description",
      defaultShow: false,
    },
    {
      id: "Product Type",
      key: "producttype",
      defaultShow: true,
    },
    {
      id: "Subject",
      key: "subject",
      defaultShow: true,
    },
    {
      id: "Competition",
      key: "competition",
      defaultShow: true,
    },
    {
      id: "Board",
      key: "boards",
      defaultShow: true,
    },
    {
      id: "Class",
      key: "class",
      defaultShow: true,
    },

    {
      id: "Product Price",
      key: "amount",
      defaultShow: true,
    },
    {
      id: "Bundle Price",
      key: "product_bundle_price",
      defaultShow: true,
    },
    {
      id: "Tax Name",
      key: "taxname",
      defaultShow: true,
    },
    {
      id: "Tax %",
      key: "taxpercent",
      defaultShow: true,
    },
    {
      id: "Last Buying",
      key: "lastbuyingdate",
      defaultShow: true,
    },
    {
      id: "Last Access",
      key: "lastaccessdate",
      defaultShow: true,
    },
    {
      id: "Show Front",
      key: "showfront",
      defaultShow: false,
    },
    {
      id: "Show In Account",
      key: "showinaccount",
      defaultShow: false,
    },
    {
      id: "Associated with Board",
      key: "associatedwithboard",
      defaultShow: false,
    },
    {
      id: "Login Required",
      key: "loginrequired",
      defaultShow: false,
    },
    {
      id: "Show To Eligible",
      key: "showtoeligible",
      defaultShow: false,
    },
    {
      id: "Quantity",
      key: "qty",
      defaultShow: true,
    },
    {
      id: "Image Url",
      key: "imageurl",
      defaultShow: false,
    },
    {
      id: "Resource Fileurl",
      key: "resourcefileurl",
      defaultShow: false,
    },
    {
      id: "HSN Code",
      key: "hsncode",
    },
    {
      id: "Bundle",
      key: "bundle",
      defaultShow: true,
    },
    {
      id: "Country",
      key: "country",
    },

    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  warehouses: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Pickup Address Line1",
      key: "pickup_addressline1",
      defaultShow: true,
    },
    {
      id: "Pickup Address Line2",
      key: "pickup_addressline2",
      defaultShow: true,
    },
    {
      id: "Pickup City",
      key: "pickup_city",
      defaultShow: true,
    },
    {
      id: "Pickup State",
      key: "pickup_state",
      defaultShow: true,
    },
    {
      id: "Pickup Pincode",
      key: "pickup_pincode",
      defaultShow: true,
    },
    {
      id: "Pickup Contact Person Name",
      key: "pickup_contact_personname",
      defaultShow: false,
    },
    {
      id: "Pickup Contact Person Number",
      key: "pickup_contact_personnumber",
      defaultShow: false,
    },
    {
      id: "Pickup Contact PersonEmail",
      key: "pickup_contact_personemail",
      defaultShow: false,
    },
    {
      id: "Country",
      key: "country",
      defaultShow: false,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  ProductCategory: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
    },
    {
      id: "Tax Name",
      key: "taxname",
      defaultShow: true,
    },
    {
      id: "Tax Percent",
      key: "taxpercent",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Students: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "Role",
      key: "role",
    },
    {
      id: "E-Mail 1",
      key: "email_1",
      defaultShow: true,
    },
    {
      id: "E-Mail 2",
      key: "email_2",
    },
    {
      id: "Mobile 1",
      key: "mobile_1",
      defaultShow: true,
    },
    {
      id: "Mobile 2",
      key: "mobile_2",
    },
    {
      id: "Gender",
      key: "gender",
    },
    {
      id: "Date of Birth (DoB)",
      key: "dob",
    },
    {
      id: "Address",
      key: "address",
    },
    {
      id: "Country",
      key: "country",
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "State",
      key: "state",
    },
    {
      id: "Pin-Code",
      key: "pincode",
    },
    {
      id: "School",
      key: "school_name",
      defaultShow: true,
    },
    {
      id: "Section",
      key: "section",
    },
    {
      id: "Class",
      key: "class_id",
      defaultShow: true,
    },
    {
      id: "Competition",
      key: "competition",
      defaultShow: true,
    },
    {
      id: "Exam Center Code",
      key: "exam_center_code",
    },
    {
      id: "Cohorts",
      key: "cohort_code",
    },
    {
      id: "Groups",
      key: "group_code",
    },
    {
      id: "Consented",
      key: "consented",
    },
    {
      id: "Is Verified",
      key: "is_verified",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Teachers: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "Role",
      key: "role",
    },
    {
      id: "E-Mail 1",
      key: "email_1",
      defaultShow: true,
    },
    {
      id: "E-Mail 2",
      key: "email_2",
    },
    {
      id: "Mobile 1",
      key: "mobile_1",
      defaultShow: true,
    },
    {
      id: "Mobile 2",
      key: "mobile_2",
    },
    {
      id: "Gender",
      key: "gender",
    },
    {
      id: "Date of Birth (DoB)",
      key: "dob",
    },
    {
      id: "Address",
      key: "address",
    },
    {
      id: "Country",
      key: "country",
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
    },

    {
      id: "PinCode",
      key: "pincode",
    },
    {
      id: "School",
      key: "school_name",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  "Relationship Managers": [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "Role",
      key: "role",
    },
    {
      id: "E-Mail 1",
      key: "email_1",
      defaultShow: true,
    },
    {
      id: "E-Mail 2",
      key: "email_2",
    },
    {
      id: "Mobile 1",
      key: "mobile_1",
      defaultShow: true,
    },
    {
      id: "Mobile 2",
      key: "mobile_2",
    },
    {
      id: "Gender",
      key: "gender",
    },
    {
      id: "Date of Birth (DoB)",
      key: "dob",
    },
    {
      id: "Address",
      key: "address",
    },
    {
      id: "Country",
      key: "country",
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
    },
    {
      id: "Pin-Code",
      key: "pincode",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  "Super Admins": [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "Role",
      key: "role",
    },
    {
      id: "E-Mail 1",
      key: "email_1",
      defaultShow: true,
    },
    {
      id: "E-Mail 2",
      key: "email_2",
    },
    {
      id: "Mobile 1",
      key: "mobile_1",
      defaultShow: true,
    },
    {
      id: "Mobile 2",
      key: "mobile_2",
    },
    {
      id: "Gender",
      key: "gender",
    },
    {
      id: "Date of Birth (DoB)",
      key: "dob",
    },
    {
      id: "Address",
      key: "address",
    },
    {
      id: "Country",
      key: "country",
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
    },
    {
      id: "Pin-Code",
      key: "pincode",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  Admins: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Username",
      key: "username",
      defaultShow: true,
    },
    {
      id: "Password",
      key: "password",
    },
    {
      id: "Role",
      key: "role",
    },
    {
      id: "E-Mail 1",
      key: "email_1",
      defaultShow: true,
    },
    {
      id: "E-Mail 2",
      key: "email_2",
    },
    {
      id: "Mobile 1",
      key: "mobile_1",
      defaultShow: true,
    },
    {
      id: "Mobile 2",
      key: "mobile_2",
    },
    {
      id: "Gender",
      key: "gender",
    },
    {
      id: "Date of Birth (DoB)",
      key: "dob",
    },
    {
      id: "Address",
      key: "address",
    },
    {
      id: "Country",
      key: "country",
    },
    {
      id: "City",
      key: "city",
      defaultShow: true,
    },
    {
      id: "State",
      key: "state",
      defaultShow: true,
    },
    {
      id: "Pin-Code",
      key: "pincode",
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
  cohorts: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Context",
      key: "context",
      defaultShow: true,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],

  groups: [
    {
      id: "Name",
      key: "name",
      defaultShow: true,
    },
    {
      id: "Code",
      key: "code",
      defaultShow: true,
    },
    {
      id: "status",
      key: "status",
    },
    { actions: true, id: "actions", defaultShow: true },
  ],
};
