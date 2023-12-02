import * as React from "react";
import { EditorView } from "@codemirror/view";

function useCodeMirror<T extends Element>(): [
  React.RefObject<T>,
  EditorView | undefined
] {
  const ref = React.useRef<T | null>(null);
  const [view, setView] = React.useState<EditorView>();

  React.useEffect(() => {
    const view = new EditorView({
      extensions: [],
      parent: ref.current!,
    });

    setView(view);

    return () => {
      view.destroy();
      setView(undefined);
    };
  }, []);

  return [ref, view];
}

export default useCodeMirror;
