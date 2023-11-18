export const findFromJson = (jsonArr: any[], key: any, josnKey: any) => {
  if (Array.isArray(jsonArr)) {
    let newJson = jsonArr.find((json) => {
      if (key == json[josnKey]) {
        return json;
      }
    });
    return newJson || {};
  }
  return {};
};

export const filterDrodownData = (data: any[], key: string, labelKey: string) => {
  let newDataData: any = [];
  data.map((item) => {
    if (item.status) {
      item.value = item[key];
      item.label = item[labelKey];
      item[key] && item[labelKey] && newDataData.push(item);
    }
  });

  return newDataData;
};

export const collectionNameGenrate = (collection: string) => {
  let data: any = {
    students: "users",
    teachers: "users",
    "relationship managers": "users",
    admin: "users",
    admins: "users",
    classes: "classes",
    boards: "boards",
    competitions: "competitions",
    "exam center": "exam_centers",
    schools: "schools",
    subjects: "subjects",
    country: "countries",
    state: "states",
    city: "cities",
    "exam center mappings": "exam_center_mapping",
    dispatch: "payments",
  };

  let collectionName = collection.toLowerCase();

  if (data[collectionName]) {
    return data[collectionName];
  } else if (!collectionName.endsWith("s")) {
    collectionName += "s";
  } else if (collectionName.endsWith("ss")) {
    collectionName += "es";
  }

  return collectionName;
};
