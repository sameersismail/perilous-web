// Alternate.

import React from "react";

import { styled } from "styled-components";

import { EditorView } from "codemirror";
import { StateEffect, StateField } from "@codemirror/state";
import { defaultKeymap } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

import useCodeMirror from "../hooks/useCodeMirror";
import ProgressBar from "../components/ProgressBar";
import TextEditor from "../components/TextEditor";

import { Scheduler, SchedulerHooks } from "../perilous/scheduler";

const DEFAULT_LENGTH = 30;

function CodeMirrorApp() {
  // CodeMirror
  const [ref, view] = useCodeMirror<HTMLDivElement>();

  // ProgressBar
  const [progressPercent, setProgressPercent] = React.useState<number>(0);
  const [progressBarColor, setProgressBarColor] =
    React.useState<string>("#d090ed");
  const [progressBarWidth, setProgressBarWidth] = React.useState<number>(0);

  const [sessionLength, _] = React.useState<number>(getSessionLength());

  /**
   * Initialise the editor, and hook up the scheduler.
   * `view` is a `useState` from `new EditorView`.
   */
  React.useEffect(() => {
    if (!view) {
      return;
    }

    /**
     * 1. Construct hooks for the scheduler.
     */
    const hooks: SchedulerHooks = {
      onInitialisation: () => {},
      onStart: (intervalId: number) => {
        setProgressBarWidth(100);
      },
      onEvent: () => {
        setProgressBarColor("#d090ed");
      },
      onWarning: (percentCompleted: number) => {
        setProgressPercent(percentCompleted);
      },
      onSuccess: () => {
        setProgressBarColor("#6ce27e");
      },
      onFailure: () => {
        setProgressBarColor("red");
        setProgressPercent(1000);
        // Replace editor state.
        const fieldContent = view.state.doc.toString();
        view.dispatch({
          changes: { from: 0, to: fieldContent.length, insert: "" },
        });
      },
      onTeardown: () => {
        // Remove all extensions.
        const transaction = view.state.update({
          effects: StateEffect.reconfigure.of([]),
        });
        view.dispatch(transaction);
      },
    };

    /**
     * 2. Create and invoke scheduler.
     */
    const scheduler = new Scheduler(sessionLength, hooks);
    scheduler.initialise((eventCallback: () => void) => {
      const onInputKeypress = StateField.define({
        create: () => null,
        update: (_, transaction) => {
          if (transaction.docChanged === false) {
            return null;
          }
          if (transaction.isUserEvent("input")) {
            eventCallback();
          }
          return null;
        },
      });

      const transaction = view.state.update({
        effects: StateEffect.reconfigure.of([
          onInputKeypress,
          EditorView.contentAttributes.of({
            autocorrect: "on",
            autocapitalize: "on",
            spellcheck: "true",
          }),
          keymap.of([...defaultKeymap]),
        ]),
      });
      view.dispatch(transaction);
    });
  }, [view]);

  React.useEffect(() => {
    setProgressBarColor(getProgressBarColor(progressPercent));
  }, [progressPercent]);

  return (
    <Wrapper>
      <ProgressBar
        width={progressBarWidth}
        sessionLength={sessionLength}
        progressPercent={progressPercent}
        color={progressBarColor}
      />
      <TextEditor ref={ref} rows={15} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
  margin: 40px auto;
`;

function getProgressBarColor(warningPercent: number) {
  if (warningPercent === 0) {
    return "#d090ed";
  } else if (0 < warningPercent && warningPercent < 40) {
    return "hsl(30deg 100% 46%)";
  } else if (40 <= warningPercent && warningPercent < 60) {
    return "hsl(18deg 86% 54%)";
  } else if (60 <= warningPercent && warningPercent < 70) {
    return "hsl(5deg 84% 58%)";
  } else if (70 <= warningPercent && warningPercent < 80) {
    return "hsl(353deg 81% 5j%)";
  } else {
    return "red";
  }
}

function getSessionLength() {
  const urlParams = new URLSearchParams(window.location.search);
  const length = urlParams.get("length");
  const sessionLength = parseInt(length || `${DEFAULT_LENGTH}`) * 1000;
  return sessionLength;
}

export default CodeMirrorApp;
