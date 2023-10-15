import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readApiData } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";

export default function Testimonials() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;
  useEffect(() => {
    setLoader(true);
    async function readData() {
      const data = await readApiData("testimonials");
      setData(data);
      setLoader(false);
    }
    readData();
  }, [selectedCountry]);

  let showData = {
    Name: true,
    School: true,
    Description: true,
    Country: true,
    Startdate: true,
    Enddate: true,
    Thumbnail: true,
    actions: true,
  };

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data.length > 0 ? data : []}
        setData={setData}
        formTypeData={showData}
        showCreateForm={true}
        formType="testimonials"
      />
      <Loader show={loader} />
    </Container>
  );
}
