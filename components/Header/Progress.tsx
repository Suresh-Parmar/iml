import styled from "styled-components";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.25);
`;

export const ProgressBar = styled.div<ProgressBarProps>`
  width: ${({ progress }) => `${progress}%`};
  height: 4px;
  background: #0c5390;
  display: flex;
  align-items: center;
`;
