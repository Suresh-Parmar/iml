import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readProductCategories, readProducts } from "@/utilities/API";
import { useSelector } from "react-redux";

const formTypeData = {
  name: true,
  code: true,
  taxname: true,
  taxpercent: true,
  country: false,
  status: false,
  actions: true,
};

export default function Products() {
  const [data, setData] = useState<MatrixDataType>([]);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  async function readData() {
    const productTypes = await readProductCategories();
    setData(productTypes);
  }

  useEffect(() => {
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="ProductCategory"
        formTypeData={formTypeData}
      />
    </Container>
  );
}
