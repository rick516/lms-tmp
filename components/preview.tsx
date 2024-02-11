"use client";

import { Editor, EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

interface PreviewProps {
  value: string;
}

const DraftEditorReadOnly = dynamic(() => import("draft-js").then((mod) => mod.Editor), { ssr: false });

export const Preview = ({ value }: PreviewProps) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    try {
      const parsedValue = JSON.parse(value);
      const contentState = convertFromRaw(parsedValue);
      setEditorState(EditorState.createWithContent(contentState));
    } catch (error) {
      console.error("Error parsing preview content:", error);
      
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  return (
    <div className="readonly p-4">
      <DraftEditorReadOnly
        editorState={editorState}
        readOnly={true}
        onChange={() => {}}
      />
    </div>
  );
};
