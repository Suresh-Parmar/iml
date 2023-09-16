import { Box } from "@mantine/core";
import dynamic from "next/dynamic";
import React, { useRef, LegacyRef } from "react";
import type ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />;
    }

    return QuillJS;
  },
  {
    ssr: false,
  }
);

// specify the Quill modules the prevent error
const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
    ["link", "image", "video"],
  ],
};

const Editor = (props: any) => {
  const { label } = props;
  const quillRef = useRef<ReactQuill>(null);
  return (
    <div style={{ margin: "20px 0 65px 0" }}>
      <Box style={{ fontWeight: 500 }}>{label}</Box>
      <ReactQuillBase forwardedRef={quillRef} theme="snow" modules={modules} {...props} style={{ height: 300 }} />
    </div>
  );
};

export default Editor;
