import React, { useEffect, useState } from "react";
import { DebouncedInput } from "../Matrix/components/DebouncedInput";
import { IconSearch } from "@tabler/icons-react";
import { Select } from "@mantine/core";
import { searchJson } from ".";
import { useSelector } from "react-redux";
import { collectionPayload } from "../utils";
import { readApiData } from "@/utilities/API";

function Search(props: any) {
  const { setData, data, formType, handleClose } = props;
  const [searchValue, setSearchValue] = useState<any>({ input: "", dropDown: "" });
  let searchJsonData: any = { ...searchJson };
  const userData: any = useSelector((state: any) => state.data);

  let selectedCountry = userData?.selectedCountry?.label;

  let dataToShowDropdown: any = [];
  let formTypeToLower: any = String(formType).toLowerCase();

  if (searchJsonData && searchJsonData[formTypeToLower]) {
    dataToShowDropdown = searchJsonData[formTypeToLower];
  }

  // filter_var = { field_to_match: { $regex: regex_pattern } };
  // testimonials: () => readApiData("testimonials"),

  let apiCall = async () => {
    let payloadData: any = collectionPayload(formType) || {};
    let apiPayload: any = {
      [searchValue.dropDown]: { $regex: searchValue.input },
      country: selectedCountry || "India",
    };

    if (payloadData?.filter_type) {
      apiPayload.role = payloadData.filter_type;
    }

    let payload = {
      ...payloadData,
      op_name: "find",
      filter_var: apiPayload,
    };

    // delete payload.filter_type;
    // delete payload.role;

    let apiData = await readApiData(undefined, payload);
    setData(apiData);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (searchValue?.input && searchValue.dropDown && searchValue?.input.length > 3) {
        apiCall();
      } else if (searchValue?.input.length == 0 && data.length == 0) {
        handleClose && handleClose();
      }
    }, 2000);

    // handleClose

    return () => clearTimeout(timeout);
  }, [searchValue?.input, searchValue.dropDown, selectedCountry]);

  return (
    <div className="d-flex gap-1">
      <Select
        onChange={(value) => setSearchValue({ ...searchValue, dropDown: value })}
        value={searchValue?.dropDown}
        withinPortal
        data={dataToShowDropdown}
      />
      <DebouncedInput
        value={searchValue?.input || ""}
        onChange={(value) => setSearchValue({ ...searchValue, input: value })}
        placeholder="Search all columns..."
        icon={<IconSearch size="1.5rem" />}
      />
    </div>
  );
}

export default Search;
