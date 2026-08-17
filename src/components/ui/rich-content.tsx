"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { useEffect } from "react";

export function RichContent({ content }: { content: Record<string, unknown>[] }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TiptapImage,
      TiptapLink.configure({
        HTMLAttributes: { class: "text-[#ff5400] underline" },
      }),
    ],
    content: { type: "doc", content },
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-8 prose-img:rounded-xl",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return <EditorContent editor={editor} />;
}
