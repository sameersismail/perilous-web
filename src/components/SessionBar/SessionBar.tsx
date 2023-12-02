import * as React from "react";
import { styled } from "styled-components";
import { SchedulerState } from "../../perilous/scheduler";

function SessionBar({
  color,
  sessionLength,
  schedulerState,
  sessionInitialised,
  resetting,
}: {
  color: string;
  schedulerState: SchedulerState;
  sessionInitialised: boolean;
  sessionLength: number | undefined;
  resetting: boolean;
}) {
  let width = schedulerState === "initialised" ? 0 : 100;

  let transition: string;
  if (resetting) {
    transition = `background-color 400ms ease-in, width 0ms linear`;
    width = 0;
  } else if (schedulerState === "initialised" || schedulerState === "running") {
    transition = `background-color 400ms ease-in, width ${sessionLength}ms linear`;
  } else {
    transition = "none";
  }

  return (
    <Wrapper invisible={sessionInitialised === false}>
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

const Wrapper = styled.div<{ invisible: boolean }>`
  position: relative;
  height: 14px;
  border-radius: 8px;
  border: 2px solid hsl(0deg 0% 40%);
  ${(p) => (p.invisible ? "visibility: hidden;" : "")}
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
  background: #dbe4ed;
`;

export default SessionBar;
