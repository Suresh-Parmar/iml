import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readPayments } from "@/utilities/API";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";

export default function Payments() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  async function readData() {
    setLoader(true);
    const payments = await readPayments();
    setLoader(false);
    setData(payments);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm={false} formType="Payments" />
      <Loader show={loader} />
    </Container>
  );
}
