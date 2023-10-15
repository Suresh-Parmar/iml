import { Modal, Group, Button } from "@mantine/core";
import React from "react";

const ModalBox = (props: any) => {
  const { open, setOpen, children, title, size } = props;

  return (
    <Modal opened={open} size={size} onClose={() => setOpen(false)} title={title} centered>
      <>{children}</>
    </Modal>
  );
};

export default ModalBox;
