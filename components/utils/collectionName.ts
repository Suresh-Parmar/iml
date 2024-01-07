const collectionPayload = (formType: any) => {
  const json: any = {
    students: {
      collection_name: "users",
      filter_type: "student",
      role: "student",
    },
    teachers: {
      collection_name: "users",
      filter_type: "teacher",
      role: "teacher",
    },
    "relationship managers": {
      collection_name: "users",
      filter_type: "rm",
      role: "rm",
    },
    admin: {
      collection_name: "users",
      filter_type: "admin",
      role: "admin",
    },
    admins: {
      collection_name: "users",
      filter_type: "admin",
      role: "admin",
    },
    classes: {
      collection_name: "classes",
    },
    boards: {
      collection_name: "boards",
    },
    competitions: {
      collection_name: "competitions",
    },
    "exam center": {
      collection_name: "exam_centers",
    },
    schools: {
      collection_name: "schools",
    },
    subjects: {
      collection_name: "subjects",
    },
    country: {
      collection_name: "countries",
    },
    state: {
      collection_name: "states",
    },
    city: {
      collection_name: "cities",
    },
    "exam center mappings": {
      collection_name: "exam_center_mapping",
    },
    dispatch: {
      collection_name: "payments",
    },
  };

  let lowercaseType = String(formType).toLowerCase();

  let collection = {};

  if (json[lowercaseType]) {
    collection = { ...collection, ...json[lowercaseType] };
  } else {
    if (!lowercaseType.endsWith("s")) {
      lowercaseType += "s";
    } else if (lowercaseType.endsWith("ss")) {
      lowercaseType += "es";
    }
    collection = { ...collection, collection_name: lowercaseType };
  }

  return collection;
};

export default collectionPayload;
