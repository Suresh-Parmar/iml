import React, { useState, useEffect } from "react";
import { ModalBox } from "../common";
import { useSelector } from "react-redux";

function DispatchModalData(props: any) {
  let { data } = props;
  const [openModal, setOpenModal] = useState(false);

  let reduxData = useSelector((state: any) => state.data);
  let themeColor = reduxData.colorScheme;

  useEffect(() => {
    setOpenModal(true);
  }, [data]);

  if (!data) {
    return "";
  }

  const Table = ({ data }: any) => {
    const renderRows = (obj: any) => {
      return Object.entries(obj).map(([key, value]: any) => {
        const field = key || "";
        if (typeof value === "object" && value !== null) {
          return (
            <React.Fragment key={field}>
              <tr>
                <th className="capitalize" colSpan={2}>
                  {field.replaceAll("_", " ")}
                </th>
              </tr>
              {renderRows(value)}
            </React.Fragment>
          );
        } else {
          return (
            value && (
              <tr key={field}>
                <td className="capitalize">{field.replaceAll("_", " ")}</td>
                <td>{field.includes("logo") ? <img src={value} style={{ maxHeight: "200px" }} /> : value}</td>
              </tr>
            )
          );
        }
      });
    };

    return (
      <table className={`table table-striped table-${themeColor}`}>
        <tbody>{renderRows(data)}</tbody>
      </table>
    );
  };

  let renderDataDetails = () => {
    return <Table data={data} />;
  };

  let showModalData = () => {
    if (typeof data.detail === "string" && data.detail.includes("Request was throttled")) {
      return <div>{data.detail}</div>;
    } else {
      return <div>{renderDataDetails()}</div>;
    }
  };

  return (
    <ModalBox size="80%" open={openModal} setOpen={setOpenModal} title="Track Shipment">
      {showModalData()}
    </ModalBox>
  );
}

export default DispatchModalData;
