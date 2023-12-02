import * as React from "react";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import { Schema, DOMParser } from "prosemirror-model";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";

import { README_CONTENT } from "../sundry/readme";

export const editorSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

const initialContent = DOMParser.fromSchema(editorSchema).parse(
  new window.DOMParser().parseFromString(README_CONTENT, "text/html").body
);

function useProseMirror<T extends Element>(): [
  React.RefObject<T>,
  EditorView | undefined
] {
  const ref = React.useRef<T | null>(null);
  const [view, setView] = React.useState<EditorView>();

  React.useEffect(() => {
    const view = new EditorView(ref.current, {
      state: EditorState.create({
        doc: initialContent,
        plugins: exampleSetup({ schema: editorSchema }),
      }),
    });

    setView(view);

    return () => {
      view.destroy();
      // setView(undefined);
    };
  }, []);

  return [ref, view];
}

export default useProseMirror;
