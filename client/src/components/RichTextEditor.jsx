import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Resize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import { useDropzone } from "react-dropzone";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  List as BulletListIcon,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { useEffect } from "react";

const fontOptions = [
  "Arial",
  "Georgia",
  "Courier New",
  "Times New Roman",
  "Verdana",
  "Tahoma",
];
const colors = [
  "black",
  "red",
  "green",
  "blue",
  "yellow",
  "lightgreen",
  "lightblue",
];
const headingLevels = [1, 2, 3, 4, 5, 6];

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: "max-width: 100%; height: auto;",
              parseHTML: (el) => el.getAttribute("style"),
              renderHTML: (attrs) => ({ style: attrs.style }),
            },
          };
        },
      }),
      Resize,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        autolink: true,
      }),
      Heading.configure({ levels: headingLevels }),
    ],
    content: value || "<p>Start writing…</p>",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value && editor.getText() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  const handleInsertURL = (type) => {
    const label = type === "image" ? "Insert image URL" : "Insert link URL";
    const url = window.prompt(label);
    if (!url) return;

    if (type === "image") {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 rounded bg-gray-50 p-2 text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-200">
        <select
          className="h-8 rounded border px-2 text-xs text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          defaultValue=""
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
        >
          <option value="" disabled>
            Font
          </option>
          {fontOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="h-8 rounded border px-2 text-xs text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          defaultValue=""
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        >
          <option value="" disabled>
            Text Color
          </option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="h-8 rounded border px-2 text-xs text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          defaultValue=""
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: e.target.value })
              .run()
          }
        >
          <option value="" disabled>
            Highlight
          </option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {headingLevels.map((level) => (
          <button
            type="button"
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={`rounded border p-1 px-2 text-xs ${editor.isActive("heading", { level }) ? "bg-gray-300" : ""}`}
          >
            H{level}
          </button>
        ))}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded border p-2 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded border p-2 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded border p-2 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded border p-2 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
        >
          <Strikethrough size={16} />
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded border p-2 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          <BulletListIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded border p-2 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded border p-2 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded border p-2 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded border p-2 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`rounded border p-2 ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}`}
        >
          <AlignJustify size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleInsertURL("image")}
          className="rounded border p-2"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleInsertURL("link")}
          className={`rounded border p-2 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
        >
          <LinkIcon size={16} />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="mt-2 min-h-[300px] rounded border border-neutral-500 p-4 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100"
      />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror a {
          color: blue;
          text-decoration: underline;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .highlight {
          background-color: yellow;
        }
      `}</style>
    </>
  );
};

export default RichTextEditor;
