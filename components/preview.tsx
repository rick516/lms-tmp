"user client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import { useMemo } from "react";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // to avoid hydration error by importin without server side rendering
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

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
