"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = {
  name: string;
  placeholder?: string;
};

export default function MarkdownEditor({ name, placeholder }: MarkdownEditorProps) {
  const [value, setValue] = useState("");
  const [colorMode] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("light") ? "light" : "dark";
  });

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
            autoCapitalize: "off",
            autoComplete: "off",
            autoCorrect: "off",
            spellCheck: false,
          }}
          height={240}
        />
      </div>
    </div>
  );
}
