import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readSchools } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const formTypeData = {
  Code: true,
  Name: true,
  City: true,
  State: true,
  Board: true,
  actions: true,
  Group: false,
  Type: false,
  Tags: false,
  Country: false,
  Address: false,
  "Pin-Code": false,
  Label: false,
  "Geographic Address": false,
  pincode: false,
  "Contact Number": true,
  "Contact E-Mail": false,
  status: false,
};

export default function Schools() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const schools = await readSchools();
      setData(schools);
    setLoader(false)
    }
    readData();
  }, [selectedCountry]);
  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data?.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType={"School"}
        formTypeData={formTypeData}
      />
      <Loader show={loader}/>
    </Container>
  );
}
