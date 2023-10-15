import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readAnnoucementsAdmin } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

export default function Annoucements() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);

  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const Annoucements = await readAnnoucementsAdmin();
      setData(Annoucements);
      setLoader(false)
    }
    readData();
  }, [selectedCountry]);
  return (
    <Container h={"100%"} fluid p={0}>
      {/* <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm
        formType={'Annoucements'}
      /> */}
       <Loader show={loader}/>
    </Container>
  );
}
