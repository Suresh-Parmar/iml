import React from "react";
import { useSelector } from "react-redux";

function SummaryForm(props: any) {
  const { form } = props;
  const values = form?.values;

  const reduxData = useSelector((state: any) => state?.data);
  let isDarkTheme = reduxData?.colorScheme == "dark";

  let {
    name,
    dob,
    address,
    city,
    class_id,
    school_name,
    section,
    competition,
    email_1,
    pincode,
    email_2,
    mobile_1,
    mobile_2,
    state,
    gender,
  } = values || {};

  let tableclass = isDarkTheme ? "table-dark" : " ";

  return (
    <div className="my-4">
      <table className={"table table-striped " + tableclass}>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{name}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{gender}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>{dob}</td>
          </tr>
          <tr>
            <th>Mobile</th>
            <td>
              {mobile_1} {mobile_2 && " / " + mobile_2}
            </td>
          </tr>

          <tr>
            <th>Email </th>
            <td>
              {email_1} {email_2 && " / " + email_2}
            </td>
          </tr>

          <tr>
            <th>Address</th>
            <td>{address}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{city}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>{state}</td>
          </tr>
          <tr>
            <th>Pincode</th>
            <td>{pincode}</td>
          </tr>
          <tr>
            <th>School Name</th>
            <td>{school_name}</td>
          </tr>
          <tr>
            <th>Class / Grade</th>
            <td>{class_id}</td>
          </tr>
          <tr>
            <th>Section</th>
            <td>{section}</td>
          </tr>
          <tr>
            <th>Competition</th>
            <td>{competition}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SummaryForm;
