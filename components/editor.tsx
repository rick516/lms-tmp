"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({ 
  value,
  onChange 
}: EditorProps) => {
  // to avoid hydration error by importin without server side rendering
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-white" >
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
      />
    </div>
  );
};
