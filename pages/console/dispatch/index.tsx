import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readPayments } from "@/utilities/API";
import { useSelector } from "react-redux";

export default function Payments() {
  const [data, setData] = useState<MatrixDataType>([]);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  async function readData() {
    const payments = await readPayments();
    setData(payments);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm={true} formType="Dispatch" />
    </Container>
  );
}
