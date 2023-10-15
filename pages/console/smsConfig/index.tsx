import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readSMSConfigs } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const formTypeData = {
  name: true,
  country: true,
  smpphost: true,
  username: true,
  password: false,
  status: false,
  actions: true,
};

export default function SMSConfigs() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const smsConfigs = await readSMSConfigs();
      setData(smsConfigs);
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
        formType="SMSConfigs"
        formTypeData={formTypeData}
      />
      <Loader show={loader}/>
    </Container>
  );
}
