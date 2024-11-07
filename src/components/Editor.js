import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  HEADING: { fontSize: "25px", fontWeight: "bold" },
  RED: { fontSize: "20px", color: "red" },
  UNDERLINE: { fontSize: "20px", textDecoration: "underline", color: "black" },
  BOLD: { fontSize: "20px", fontWeight: "bold" },
};

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockText = block.getText().slice(0, selection.getStartOffset());

    // Check for patterns
    if (chars === " " && blockText.endsWith("#")) {
      const newContent = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "remove-range"
      );
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
      return "handled";
    }

    if (chars === " " && blockText.length === 1 && blockText.endsWith("*")) {
      const newContent = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      return "handled";
    }

    if (chars === " " && blockText.length === 2 && blockText.endsWith("**")) {
      const newContent = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 2,
          focusOffset: selection.getStartOffset(),
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED"));
      return "handled";
    }

    if (chars === " " && blockText.length === 3 && blockText.endsWith("***")) {
      const newContent = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getStartOffset(),
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
      return "handled";
    }

    return "not-handled";
  };

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(content))
    );
  };

  return (
    <div>
      <h3>Demo editor by Amir Sayyad</h3>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
        }}
      >
        <Editor
          editorState={editorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
          onChange={setEditorState}
        />
      </div>
      <button onClick={saveContent}>Save</button>
    </div>
  );
};

export default TextEditor;
