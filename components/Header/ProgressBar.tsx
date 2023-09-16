import React from "react";
import { ProgressBar, ProgressBarContainer } from "./Progress";

const ProgressBarLoader = ({ progress }:any) => {
  return (
    <ProgressBarContainer>
      <ProgressBar progress={progress}></ProgressBar>
    </ProgressBarContainer>
  );
};

export default ProgressBarLoader;
