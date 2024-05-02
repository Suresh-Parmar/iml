import { setGetData } from "@/helpers/getLocalStorage";
import { ControlApplicationShellComponents } from "@/redux/slice";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function RMHomePage() {
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

  return (
    <div className="d-flex justify-content-around align-items-center p-3 ">
      <div className="w-100">
        <div className="d-flex justify-content-around align-items-center py-3 flex-wrap">
          <div className="circleDiv">
            <div className="fs-1">10</div>
            <div>No Of Schools</div>
          </div>
          <div className="circleDiv">
            <div className="fs-1">500</div>
            <div>No Of Students</div>
          </div>
        </div>
        <div className="my-3 fs-5">Dispatches</div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr style={{ whiteSpace: "nowrap" }}>
                <th className="text-center">Sr. No.</th>
                <th>Dispatch Date</th>
                <th>AWB No</th>
                <th>Consignee Name</th>
                <th>Description of goods</th>
                <th>Weight (kg)</th>
                <th>Status</th>
                <th>Tracking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td>20-04-2024</td>
                <td>XYZ</td>
                <td>Consignee Name</td>
                <td>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum iusto excepturi debitis at voluptatem.
                  Blanditiis ut reiciendis consectetur autem labore nobis, debitis, obcaecati, dolore similique illo
                  commodi ducimus iste expedita.
                </td>
                <td>50.5</td>
                <td>Status</td>
                <td>Tracking</td>
              </tr>

              <tr>
                <td className="text-center">2</td>
                <td>28-04-2024</td>
                <td>ABC</td>
                <td>Consignee Name</td>
                <td>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum iusto excepturi debitis at voluptatem.
                  Blanditiis ut reiciendis consectetur autem labore nobis, debitis, obcaecati, dolore similique illo
                  commodi ducimus iste expedita.
                </td>
                <td>10.5</td>
                <td>Status</td>
                <td>Tracking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RMHomePage;
