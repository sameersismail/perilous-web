import * as React from "react";
import { styled } from "styled-components";

// Relies upon `editor.css` in `index.html`.

const ProseMirrorEditor = styled.div`
  background: white;
  color: black;
  background-clip: padding-box;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  margin-bottom: 23px;

  .ProseMirror {
    height: 60vh;
    overflow: auto;
  }

  @media (max-width: 550px) {
    .ProseMirror {
      height: 55vh;
    }
  }

  /* Custom styles */
  h1,
  h2,
  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: var(--font-weight-bold);
    line-height: 1.25;
    font-family: var(--font-family-serif);
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 24px;
    padding-bottom: 0.3em;
    border-bottom: 1px solid hsla(210, 18%, 87%, 1);
    font-weight: 650;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  ul,
  ol {
    list-style-position: inside;
    list-style-type: circle;
    padding-left: 16px;
  }

  ol {
    list-style-type: decimal;
  }

  a {
    cursor: pointer;
    color: blue;
  }
`;

export default ProseMirrorEditor;
