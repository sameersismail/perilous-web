import * as React from "react";
import { styled } from "styled-components";

function TextEditor(
  { rows }: { rows: number },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <Editor ref={ref} rows={rows} />;
}

const Editor = styled.div<{ rows: number }>`
  max-width: 100%;
  font-size: calc(14 / 16 * 1rem);
  background: hsl(0deg 0% 98%);
  border: 2px solid hsl(0deg 0% 93%);
  padding: 8px;
  border-radius: 4px;
  container-type: inline-size;

  & .cm-line {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    padding: 0;
    font-size: 16px;
    margin-left: auto;
    margin-right: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  @container (min-width: 100px) {
    & .cm-line {
      /* Minus the padding and border. */
      max-width: calc(100cqw - (2 * 8px + 2 * 2px));
    }
  }

  & .cm-editor {
    min-height: calc(1rem * ${(props) => props.rows});
    /* overflow: auto; */
  }

  & .cm-focused {
    outline: none;
  }
`;

export default React.forwardRef(TextEditor);
