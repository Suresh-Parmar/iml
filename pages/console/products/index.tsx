import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readProducts } from "@/utilities/API";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";

export default function Products() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  async function readData() {
    setLoader(true);
    const products = await readProducts();
    setLoader(false);

    setData(products);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm={true} formType="Products" />
      <Loader show={loader} />
    </Container>
  );
}
