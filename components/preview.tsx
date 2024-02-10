"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // to avoid hydration error by importing without server side rendering
  const ReactQuill = useMemo(() => dynamic(import("react-quill"), { 
    ssr: false,
  }), []);

  return (
    <div className="readonly" >
      <ReactQuill 
        theme="bubble"
        value={value}
        readOnly
      />
    </div>
  );
};
