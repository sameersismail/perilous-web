import * as React from "react";
import { styled } from "styled-components";

function ProgressBar({
  color,
  width,
  sessionLength,
  progressPercent,
}: {
  color: string;
  width: number;
  sessionLength: number;
  progressPercent: number;
}) {
  const transition =
    progressPercent === 1000
      ? `background-color 0ms linear`
      : `background-color 200ms ease-in, width ${sessionLength}ms linear`;

  return (
    <Wrapper>
      <Background />
      <Bar
        style={{
          width: `${width}%`,
          backgroundColor: color,
          transition: transition,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  height: 8px;
`;

const Bar = styled.div`
  position: absolute;
  height: 100%;
  border-radius: 4px;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: hsl(0deg 0% 93%);
`;

export default ProgressBar;
