import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readAnnoucements } from "@/utilities/API";
import { RoleMatrix } from "@/components/permissions";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

export default function Announcements() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

  useEffect(() => {
    setLoader(true)
    async function readData() {
      const newData = await readAnnoucements();
      setData(newData);
      setLoader(false)
    }
    readData();
  }, [selectedCountry]);

  return (
    <Container h={"100%"} fluid p={0}>
      <RoleMatrix />
      <Loader show={loader}/>
    </Container>
  );
}
