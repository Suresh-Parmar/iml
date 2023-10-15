import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readSMTPConfigs } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

const formTypeData = {
  name: true,
  country: true,
  is_default: true,
  from_email: false,
  send_protocol: true,
  smtp_host: true,
  smtp_password: false,
  smtp_port: true,
  smtp_user: true,
  status: false,
  actions: true,
};

export default function SMTPConfigs() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const smtpConfigs = await readSMTPConfigs();
      setData(smtpConfigs);
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
        formType="SMTPConfigs"
        formTypeData={formTypeData}
      />
      <Loader show={loader}/>
    </Container>
  );
}
