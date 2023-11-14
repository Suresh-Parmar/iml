import { FileInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import React from "react";

function FileInputCustom(props: any) {
  const viewImage = () => {
    if (props.value) {
      let imageStyle = {
        width: "250px",
        margin: "20px",
      };
      if (typeof props.value == "object") {
        return <img src={URL.createObjectURL(props.value)} style={imageStyle} />;
      } else {
        return <img src={props.value} style={imageStyle} />;
      }
    }
  };

  return (
    <div className="w-100">
      <FileInput {...props} icon={<IconUpload size={14} />} />
      {viewImage()}
    </div>
  );
}

export default FileInputCustom;
