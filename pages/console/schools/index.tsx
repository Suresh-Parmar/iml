import { Container } from "@mantine/core";
import Matrix, { MatrixDataType } from "@/components/Matrix";
import { useEffect, useState } from "react";
import { readSchools } from "@/utilities/API";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import { setGetData } from "@/helpers/getLocalStorage";

export default function Schools() {
  const [data, setData] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const userData: any = useSelector((state: any) => state.data);
  let selectedCountry = userData?.selectedCountry?.label;

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
    collection_name: "schools",
    op_name: "find_many",
    ...pagiData,
    filter_var: {
      country: selectedCountry,
    },
  };

  useEffect(() => {
    setLoader(true);
    async function readData() {
      const schools: any = await readSchools(undefined, undefined, payload, true);
      let limits = { total_count: schools?.data?.total_count, total_pages: schools?.data?.total_pages };

      setTotalrecords(limits);
      setData(schools.data.response || []);

      setLoader(false);
    }
    readData();
  }, [selectedCountry, Number(pagiData.page), Number(pagiData.limit)]);

  return (
    <Container h={"100%"} fluid p={0}>
      <Matrix
        data={data?.length > 0 ? data : []}
        setData={setData}
        showCreateForm={true}
        formType={"School"}
        showApiSearch={true}
        totalrecords={totalrecords}
        setPagiData={setPagiData}
        pagiData={pagiData}
      />
      <Loader show={loader} />
    </Container>
  );
}
