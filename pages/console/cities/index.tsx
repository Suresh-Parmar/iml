import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readCities } from "@/utilities/API";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";

export default function Cities() {
  const [data, setData] = useState<MatrixDataType>([]);
  const country_selected: any = useSelector((state) => state);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const users = await readCities();
      setData(users);
      setLoader(false)
    }
    readData();
  }, [country_selected?.client?.selectedCountry?.name,selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix data={data.length > 0 ? data : []} setData={setData} showCreateForm formType={"City"} />
      <Loader show={loader}/>
    </Container>
  );
}
