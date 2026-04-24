"use client";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

type MarkdownEditorProps = {
  name: string;
  placeholder?: string;
};

export default function MarkdownEditor({ name, placeholder }: MarkdownEditorProps) {
  const [value, setValue] = useState("");
  const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setColorMode(isLight ? "light" : "dark");
  }, []);

  return (
    <div suppressHydrationWarning>
      <div className="border border-border rounded-md overflow-hidden" data-color-mode={colorMode}>
        <input type="hidden" name={name} value={value} />
        <MDEditor
          value={value}
          onChange={(nextValue) => setValue(nextValue ?? "")}
          preview="edit"
          textareaProps={{
            placeholder: placeholder ?? "Write your review...",
            required: true,
          }}
          height={240}
        />
      </div>
    </div>
  );
}
