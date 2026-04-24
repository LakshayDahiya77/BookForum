"use client";

import MDEditor from "@uiw/react-md-editor";

type MarkdownPreviewProps = {
  source: string;
  className?: string;
};

export default function MarkdownPreview({ source, className }: MarkdownPreviewProps) {
  return (
    <div className={className} data-color-mode="dark">
      <MDEditor.Markdown source={source} />
    </div>
  );
}
