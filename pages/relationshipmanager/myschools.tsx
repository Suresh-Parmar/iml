import CustomTable from "@/components/Table";
import Loader from "@/components/common/Loader";
import { setGetData } from "@/helpers/getLocalStorage";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { rmSchools } from "@/utilities/API";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Myschools() {
  const [schoolsData, setSchoolsData] = useState([]);
  const [loader, setLoader] = useState<any>(false);

  const dispatch = useDispatch();
  let authentication: any = setGetData("userData", false, true);
  let role = authentication?.user?.role;
  const router: any = useRouter();

  useEffect(() => {
    if (role == "student") {
      router.replace("/");
    }

    if (authentication?.metadata?.status == "unauthenticated" || !authentication) {
      router.replace("/authentication/signin");
    } else {
      dispatch(
        ControlApplicationShellComponents({
          showHeader: true,
          showFooter: false,
          showNavigationBar: role == "student",
          hideNavigationBar: false,
          showAsideBar: false,
        })
      );
    }
  }, [authentication?.metadata?.status, dispatch, router]);

  const getSchools = () => {
    setLoader(true);
    rmSchools()
      .then((res) => {
        setLoader(false);
        setSchoolsData(res.data.data);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getSchools();
  }, []);

  const renderTable = () => {
    const headers = [
      "Sr. No.",
      "School Name",
      "Total Students",
      "Email",
      "Mobile Number",
      "Exam Date",
      "State",
      "City",
    ];
    const keys = [
      "index",
      "school_name",
      "number_of_students",
      "contact_email",
      "contact_number",
      "exam_date",
      "state",
      "city",
    ];

    return (
      <div>
        <CustomTable headers={headers} data={schoolsData} keys={keys} />
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="fs-4">My Schools</div>
      {/* <div className="d-flex align-items-center justify-content-between mb-1">
        <div />
        <div> Search </div>
      </div> */}
      {renderTable()}
      <Loader show={loader} />
    </div>
  );
}

export default Myschools;
