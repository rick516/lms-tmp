"use client";

import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const DraftEditor = dynamic(() => import("draft-js").then((mod) => ({ default: mod.Editor })), { ssr: false });

export const RichEditor = ({
  value,
  onChange,
}: EditorProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    try {
      const contentState = value ? convertFromRaw(JSON.parse(value)) : null;
      if (contentState) {
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (error) {
      console.error("Error parsing editor content:", error);
    }
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
  };

  return (
    <div className="bg-white">
      <DraftEditor
        editorState={editorState}
        onChange={handleEditorChange}
      />
    </div>
  );
};
