import React from "react";

function Loader(props: any) {
  const { show } = props;

  if (show) {
    return (
      <div
        className="w-100"
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          background: "#ffffffc9",
          zIndex: 99999999,
        }}
      >
        <div className="spinner-grow spinner-grow-sm mx-1 text-danger" role="status" />
        <div className="spinner-grow spinner-grow-sm mx-1 text-warning" role="status" />
        <div className="spinner-grow spinner-grow-sm mx-1 text-success" role="status" />
      </div>
    );
  } else {
    return;
  }
}

export default Loader;
