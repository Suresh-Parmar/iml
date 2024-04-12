import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readApiData } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

export default function Announcements() {
  const [data, setData] = useState<MatrixDataType>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?._id;

  let savedPageSize = setGetData("pagesize");
  if (savedPageSize) {
    if (!isNaN(savedPageSize)) {
      savedPageSize = Number(savedPageSize);
    } else {
      savedPageSize = 25;
    }
  }

  const [totalrecords, setTotalrecords] = useState<any>({ totalPages: 1, pageSize: savedPageSize });
  const [pagiData, setPagiData] = useState<any>({ page: 1, limit: savedPageSize || 25 });

  let payload = {
    collection_name: "marks",
    op_name: "find_many",
    ...pagiData,
    filter_var: {
      country_id: selectedCountry,
    },
  };

  useEffect(() => {
    setLoader(true);
    async function readData() {
      const newData = await readApiData("marks", payload);
      setData(newData);
      setLoader(false);
    }
    readData();
  }, [selectedCountry]);

  //

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        setPagiData={setPagiData}
        pagiData={pagiData}
        showApiSearch={true}
        data={data.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType="marks"
        showLabel="Marks Sheet"
      />
      <Loader show={loader} />
    </Container>
  );
}
