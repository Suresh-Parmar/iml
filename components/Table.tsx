import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CustomTable = ({
  data,
  headers,
  keys,
  onClickRow,
  expose,
  getSingleColumn,
}: {
  data: any;
  headers: any;
  keys: any[];
  onClickRow?: any;
  expose?: any;
  getSingleColumn?: Boolean;
}) => {
  const [columnWidths, setColumnWidths] = useState<any>({});
  const [isResizing, setIsResizing] = useState<any>(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<any>(null);
  const [initialX, setInitialX] = useState<any>(null);

  let themeColor = useSelector((state: any) => state.data.colorScheme);

  let firstRow = data[0];
  let extraKeys: any = [];

  if (firstRow && expose) {
    extraKeys = firstRow[expose] || {};
    extraKeys = Object.keys(extraKeys);
  }

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (isResizing) {
        const width = event.clientX - initialX;
        setColumnWidths((prevState: any) => ({
          ...prevState,
          [resizingColumnIndex]: (prevState[resizingColumnIndex] || 100) + width,
        }));
        setInitialX(event.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingColumnIndex(null);
      setInitialX(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, initialX, resizingColumnIndex]);

  const handleMouseDown = (event: any, columnIndex: any) => {
    setIsResizing(true);
    setResizingColumnIndex(columnIndex);
    setInitialX(event.clientX);
  };

  const renderTableBody = () => {
    if (!Array.isArray(data)) {
      console.log("data is not an array ----------------");
      console.log(data);
      return <></>;
    }
    return data.map((row: any, rowIndex: any) => {
      if (expose) {
        row = { ...row, ...row[expose] };
      }
      return (
        <tr onClick={() => onClickRow && !getSingleColumn && onClickRow(row)} key={rowIndex}>
          {[...keys, ...extraKeys].map((key: any, columnIndex: any) => {
            if (key == "index") {
              return <td key={rowIndex}>{rowIndex + 1}</td>;
            }

            return (
              <td
                onClick={() => {
                  if (getSingleColumn && onClickRow) {
                    onClickRow(key, row[key], row);
                  }
                }}
                key={columnIndex}
              >
                {row[key]}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  const ResizeHandle = ({ columnIndex, onMouseDown }: { columnIndex: any; onMouseDown: any }) => {
    return <div className="resize-handle" onMouseDown={(event) => onMouseDown(event, columnIndex)} />;
  };

  if (!data.length) {
    return <div className="fs-5 text-center my-5">No Records found</div>;
  }
  return (
    <div className="resizable-table table-responsive">
      <table key={themeColor} className={`table table-striped table-${themeColor}`}>
        <thead>
          <tr>
            {[...headers, ...extraKeys].map((header: any, index: any) => (
              <th key={index} style={{ width: columnWidths[index] || "auto", whiteSpace: "nowrap" }}>
                {header}
                <ResizeHandle columnIndex={index} onMouseDown={handleMouseDown} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default CustomTable;
