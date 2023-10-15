import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readTempates } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const formTypeData = {
  _id: false,
  country: false,
  created_at: false,
  name: true,
  status: false,
  shortname: true,
  templatetype: true,
  content: false,
  subject: true,
};

export default function Templates() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  
  useEffect(() => {
    setLoader(true)
    async function readData() {
      const templates = await readTempates();
      setData(templates);
    setLoader(false)
    }
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="Templates"
        formTypeData={formTypeData}
      />
      <Loader show={loader}/>
    </Container>
  );
}
