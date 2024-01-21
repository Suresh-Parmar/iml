import React, { useEffect, useState } from "react";
import { siteJson } from "./index";
import { updateDataRes } from "@/utilities/API";
import { findFromJson } from "@/helpers/filterFromJson";

const Matrix = (props: any) => {
  const { title, onclick, filterID } = props;
  const [rolesJosn, setRolesJosn] = useState<any>(siteJson);
  const [updateData, setUpdateData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [filterID]);

  const matchJsonAndFilter = (jsonArr: any, jsonArr1: any = rolesJosn) => {
    if (jsonArr) {
      let newArr: any[] = [];
      jsonArr1.map((item: any) => {
        let obj = findFromJson(jsonArr, item.link, "link");

        if (!Object.keys(obj).length) {
          newArr.push(item);
        } else {
          newArr.push(obj);
        }
      });

      setRolesJosn([...newArr]);
    }
  };

  let fetchData = () => {
    updateDataRes("rolemappings", "", "name", filterID, "find_many")
      .then((res) => {
        if (res?.data?.response[0]) {
          setUpdateData(res?.data?.response[0]);
          matchJsonAndFilter(res?.data?.response[0]?.data, rolesJosn);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSectionCheckboxChange = (event: any, obj: any, key: string) => {
    const { checked } = event.target;
    obj[key] = checked;

    setRolesJosn([...rolesJosn]);
  };

  let checkAll = (obj: any, isTrue: any, extraKey?: any) => {
    if (extraKey && Array.isArray(obj)) {
      obj.map((dataobj: any) => {
        dataobj[extraKey] = !!isTrue;
      });
    } else {
      Object.keys(obj).map((key) => {
        obj[key] = !!isTrue;
      });
    }
    return obj;
  };

  const selectAll = (event: any, index: any = 0) => {
    let { checked } = event.target;
    if (checked) {
      if (rolesJosn[index].extra_permissions) {
        rolesJosn[index].extra_permissions = [...checkAll(rolesJosn[index].extra_permissions, true, "show")];
      }
      rolesJosn[index].permissions = { ...checkAll(rolesJosn[index].permissions, true) };
    } else {
      if (rolesJosn[index].extra_permissions) {
        rolesJosn[index].extra_permissions = [...checkAll(rolesJosn[index].extra_permissions, false, "show")];
      }
      rolesJosn[index].permissions = { ...checkAll(rolesJosn[index].permissions, false) };
    }
    setRolesJosn([...rolesJosn]);
  };

  let checkIsChecked = (index: number = 0) => {
    let isChecked: any = true;
    let obj: any = rolesJosn[index].permissions;
    let obj1: any = rolesJosn[index].extra_permissions;

    if (obj1 && Array.isArray(obj1)) {
      obj1.map((item) => {
        if (!item.show) {
          isChecked = false;
        }
      });
    }

    Object.keys(obj).map((key) => {
      if (!obj[key]) {
        isChecked = false;
      }
    });
    return isChecked;
  };

  const renderSections = (dataObj: any, title: any = "") => {
    return Object.keys(dataObj).map((item, index) => {
      let rowData = dataObj[item];
      return (
        <div key={index} className="align-items-center d-flex">
          <input
            id={item + title}
            type="checkbox"
            name={item + title}
            checked={rowData}
            onChange={(event) => handleSectionCheckboxChange(event, dataObj, item)}
          />
          <label htmlFor={item + title} className="ms-1 capitalize">
            {item}
          </label>
        </div>
      );
    });
  };

  const renderCard = (title: any, listData: any, index: number = 0, icon: any, extra_permissions: any) => {
    return (
      <div className="card border-dark mb-3" style={{ width: "360px" }}>
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <span className="d-flex align-items-center gap-2">
              {icon && <span className="material-symbols-outlined">{icon}</span>}
              <b>{title}</b>
            </span>
            <div className="align-items-center d-flex">
              <input
                id={title}
                type="checkbox"
                name={title}
                checked={checkIsChecked(index)}
                onChange={(event) => selectAll(event, index)}
              />
              <label htmlFor={title} className="ms-1 capitalize">
                Select All
              </label>
            </div>
          </div>
        </div>
        <div className="card-body d-flex flex-wrap gap-3 justify-content-between">
          {listData}
          {extra_permissions}
        </div>
      </div>
    );
  };

  const renderExtra = (extra_permissions: any) => {
    if (!extra_permissions) {
      return <></>;
    }

    if (Array.isArray(extra_permissions)) {
      return extra_permissions.map((item: any, index: any) => {
        let { label, value, show } = item;

        return (
          <div key={index} className="align-items-center d-flex">
            <input
              id={value}
              type="checkbox"
              name={value}
              checked={show}
              onChange={(event) => {
                handleSectionCheckboxChange(event, item, "show");
              }}
            />
            <label htmlFor={value} className="ms-1 capitalize">
              {label}
            </label>
          </div>
        );
      });
    }

    return <></>;
  };

  const renderCheckboxes = () => {
    return rolesJosn.map((item: any, index: any) => {
      let { link, title, permissions, icon, extra_permissions } = item;

      return (
        <div key={link + index}>
          {renderCard(title, renderSections(permissions, title), index, icon, renderExtra(extra_permissions))}
        </div>
      );
    });
  };

  return (
    <>
      {/* <div className="m-4">User Role</div> */}
      <div className="d-flex flex-wrap m-4 gap-3 justify-content-around">{renderCheckboxes()}</div>
      <div className="px-4 pt-2 position-sticky bottom-0 bg-white">
        <button
          onClick={() => {
            onclick && onclick(rolesJosn, updateData);
          }}
          className="btn btn-primary form-control mb-4"
        >
          {title || "save"}
        </button>
      </div>
    </>
  );
};

export default Matrix;
