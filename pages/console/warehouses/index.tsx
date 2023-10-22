import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readApiData, readPayments } from "@/utilities/API";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";

export default function Warehouses() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true);
    async function readData() {
      const newData = await readApiData("warehouses");
      setData(newData);
      setLoader(false);
    }
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm={true} formType="warehouses" />
      <Loader show={loader} />
    </Container>
  );
}
