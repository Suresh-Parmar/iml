import React, { useState, useEffect } from "react";

const CustomTable = ({ data, headers, keys }: { data: any; headers: any; keys: any[] }) => {
  const [columnWidths, setColumnWidths] = useState<any>({});
  const [isResizing, setIsResizing] = useState<any>(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<any>(null);
  const [initialX, setInitialX] = useState<any>(null);

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
    return data.map((row: any, rowIndex: any) => (
      <tr key={rowIndex}>
        {keys.map((key: any, columnIndex: any) => {
          if (key == "index") {
            return <td key={rowIndex}>{rowIndex + 1}</td>;
          }

          return <td key={columnIndex}>{row[key]}</td>;
        })}
      </tr>
    ));
  };

  const ResizeHandle = ({ columnIndex, onMouseDown }: { columnIndex: any; onMouseDown: any }) => {
    return <div className="resize-handle" onMouseDown={(event) => onMouseDown(event, columnIndex)} />;
  };

  if (!data.length) {
    return <div className="fs-5 text-center my-5">No Records found</div>;
  }
  return (
    <div className="resizable-table table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {headers.map((header: any, index: any) => (
              <th key={index} style={{ width: columnWidths[index] || "auto" }}>
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
