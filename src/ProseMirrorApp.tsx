import React from "react";
import { styled } from "styled-components";

import { initialState, reducer } from "./datastore";
import { SchedulerHooks } from "./perilous/scheduler";

import Header from "./components/Header";
import SessionBar from "./components/SessionBar";
import useProseMirror from "./hooks/useProseMirror";
import GlobalStyles from "./components/GlobalStyles";
import SessionButtons from "./components/SessionButtons";
import MaxWidthWrapper from "./components/MaxWidthWrapper";
import BackgroundImage from "./components/BackgroundImage";
import ProseMirrorEditor from "./components/ProseMirrorEditor";

function ProseMirrorApp() {
  const [ref, view] = useProseMirror<HTMLDivElement>();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [resetting, setResetting] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!view) {
      return;
    }
    dispatch({ type: "createView", view: view });
  }, [view]);

  let color = getProgressBarColor(state.warningPercent || 0);
  if (state.scheduler?.schedulerState === "success") {
    color = PROGRESS_BAR_COLORS["success"];
  } else if (state.scheduler?.schedulerState === "failure") {
    color = PROGRESS_BAR_COLORS["fail"];
  }

  function onSetSessionLength(sessionLength: number) {
    if (
      state.scheduler?.schedulerState === "success" ||
      state.scheduler?.schedulerState === "failure"
    ) {
      setResetting(true);
      dispatch({ type: "completed", successful: true });
    }

    const hooks: SchedulerHooks = {
      onInitialisation: () => {
        setTimeout(() => {
          setResetting(false);
        }, 50); // Slightly stagger to allow transition to reset.
      },
      onStart: (_: number) => {
        dispatch({ type: "start" });
      },
      onEvent: () => {
        dispatch({ type: "running" });
      },
      onWarning: (percentCompleted: number) => {
        dispatch({
          type: "warning",
          warningPercent: percentCompleted,
        });
      },
      onSuccess: () => {
        dispatch({ type: "success" });
        focusProseMirror();
      },
      onFailure: () => {
        dispatch({ type: "failed" });
      },
      onTeardown: () => {},
    };

    dispatch({
      type: "initialise",
      sessionLength: sessionLength,
      hooks: hooks,
      view: view!,
    });
    focusProseMirror();
  }

  function focusProseMirror() {
    // There's no callback, so wait… a bit for the state update.
    setTimeout(() => {
      (
        ref.current?.getElementsByClassName("ProseMirror")[0] as HTMLElement
      ).focus();
    }, 10);
  }

  return (
    <Wrapper>
      <BackgroundImage />
      <MaxWidthWrapper>
        <MainContent>
          <Header />
          <EditorSection>
            <SessionBar
              schedulerState={state.scheduler?.schedulerState || "initialised"}
              resetting={resetting}
              sessionInitialised={state.scheduler !== undefined}
              sessionLength={state.sessionLength}
              color={color}
            />
            <div>
              <ProseMirrorEditor
                id="editor"
                ref={ref}
                style={{ marginBottom: "23px" }}
              />
              <div id="content" style={{ display: "none" }}></div>
            </div>
          </EditorSection>
          <SessionButtons
            setSessionLength={onSetSessionLength}
            disabled={
              state.scheduler?.schedulerState === "running" ||
              state.scheduler?.schedulerState === "initialised"
            }
          />
        </MainContent>
      </MaxWidthWrapper>
      <GlobalStyles />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  position: relative;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: calc(36px - 20px);
  padding-top: 36px;
  height: 100%;

  @media (max-width: 550px) {
    gap: calc(18px - 10px);
    padding-top: 18px;
  }
`;

const EditorSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PROGRESS_BAR_COLORS = {
  initial: "#3076bc",
  1: "#8DB9E3",
  2: "#E9D5AE",
  3: "#EABA6C",
  4: "#F5A623",
  success: "#08b94e",
  fail: "#DC4B5D",
};

function getProgressBarColor(warningPercent: number) {
  if (warningPercent === 0) {
    return PROGRESS_BAR_COLORS["initial"];
  } else if (0 < warningPercent && warningPercent < 40) {
    return PROGRESS_BAR_COLORS[1];
  } else if (40 <= warningPercent && warningPercent < 60) {
    return PROGRESS_BAR_COLORS[2];
  } else if (60 <= warningPercent && warningPercent < 70) {
    return PROGRESS_BAR_COLORS[3];
  } else if (70 <= warningPercent && warningPercent < 80) {
    return PROGRESS_BAR_COLORS[4];
  } else {
    return PROGRESS_BAR_COLORS["fail"];
  }
}

export default ProseMirrorApp;
