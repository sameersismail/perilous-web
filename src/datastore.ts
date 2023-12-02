import { EditorView } from "prosemirror-view";
import { ReplaceStep } from "prosemirror-transform";
import { exampleSetup } from "prosemirror-example-setup";
import { EditorState, TextSelection } from "prosemirror-state";

import { log } from "./sundry/utilities";
import { editorSchema } from "./hooks/useProseMirror";
import { Scheduler, SchedulerHooks } from "./perilous/scheduler";

type NoSession = {
  type: "noSession";
};

type CreateView = {
  type: "createView";
  view: EditorView;
};

type Initialise = {
  type: "initialise";
  sessionLength: number;
  view: EditorView;
  hooks: SchedulerHooks;
};

type Start = {
  type: "start";
};

type Running = {
  type: "running";
};

type Warning = {
  type: "warning";
  warningPercent: number;
};

type Failed = {
  type: "failed";
};

type Success = {
  type: "success";
};

type Completed = {
  type: "completed";
  successful: boolean;
};

type Action =
  | NoSession
  | CreateView
  | Initialise
  | Start
  | Running
  | Warning
  | Failed
  | Success
  | Completed;

type State = {
  scheduler: Scheduler | undefined;
  sessionLength: number | undefined;
  editorView: EditorView | undefined;
  initialSnapshot: EditorState | undefined;
  warningPercent: number | undefined;
};

export const initialState: State = {
  scheduler: undefined,
  sessionLength: undefined,
  editorView: undefined,
  initialSnapshot: undefined,
  warningPercent: undefined,
};

export function reducer(state: State, action: Action): State {
  log({ type: action.type, action });

  const view = state.editorView!;
  switch (action.type) {
    case "noSession":
      return { ...state };
    case "createView":
      return {
        ...state,
        editorView: action.view,
        initialSnapshot: action.view.state,
      };
    case "initialise":
      const sched = new Scheduler(action.sessionLength, action.hooks);
      sched.initialise((eventCallback: () => void) => {
        view.setProps({
          state: EditorState.create({
            doc: view.state.doc,
            selection: TextSelection.create(
              view.state.doc,
              view.state.doc.content.size - 1
            ),
            plugins: exampleSetup({ schema: editorSchema }),
          }),
          dispatchTransaction(transaction) {
            const newState = view.state.apply(transaction);
            view.updateState(newState);
            for (const step of transaction.steps) {
              if (!(step instanceof ReplaceStep)) {
                continue;
              }
              if (step.slice.content.size > step.to - step.from) {
                eventCallback();
              }
            }
          },
        });
      });

      return {
        ...state,
        scheduler: sched,
        sessionLength: action.sessionLength,
      };
    case "start":
      return { ...state };
    case "running":
      return { ...state, warningPercent: 0 };
    case "warning":
      return { ...state, warningPercent: action.warningPercent };
    case "failed":
      view.setProps({
        state: EditorState.create({
          doc: state.initialSnapshot!.doc,
          plugins: exampleSetup({ schema: editorSchema }),
        }),
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
        },
      });
      return { ...state };
    case "success":
      view.setProps({
        state: EditorState.create({
          doc: view.state.doc,
          selection: view.state.selection,
          plugins: exampleSetup({ schema: editorSchema }),
        }),
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
        },
      });
      return { ...state };
    case "completed":
      return {
        ...initialState,
        editorView: state.editorView,
        initialSnapshot: state.editorView!.state,
      };
  }
}
