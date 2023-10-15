import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readCompetitions } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const formTypeData = {
  Name: true,
  Subject: true,
  "Parent Competition": true,
  Country: false,
  Code: false,
  Tags: false,
  Mode: true,
  Message: false,
  status: false,
  actions: true,
};

export default function Competitions() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  useEffect(() => {
    setLoader(true)
    async function readData() {
      const competitions = await readCompetitions();
      setData(competitions);
    setLoader(false)

    }
    readData();
  }, [selectedCountry]);
  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm
        formType={"Competition"}
        formTypeData={formTypeData}
      />
         <Loader show={loader}/>
    </Container>
  );
}
