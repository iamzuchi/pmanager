"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { toast } from "sonner";
import { getDocumentation, updateDocumentation } from "@/app/data/project/get-documentation";

interface DocumentationProps {
  projectId: string;
  initialContent: string;
  workspaceId: string;
}

export const ProjectDocumentation = ({ projectId }: DocumentationProps) => {
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Loading documentation...</p>",
  });

  useEffect(() => {
    const fetchContent = async () => {
      const doc = await getDocumentation(projectId);
      editor?.commands.setContent(doc?.content  ||  "<p>No documentation yet.</p>");
    };
    if (editor) fetchContent();
  }, [editor, projectId]);

  const handleSave = async () => {
    if (!editor) return;
    setLoading(true);
    await updateDocumentation(projectId, editor.getHTML());
    toast.success("Documentation updated.");
    setLoading(false);
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
    <h3 className="text-lg font-semibold">Documentation</h3> 

    <div className="rounded-lg border border-gray-300 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-3 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`border border-gray-300 dark:border-gray-600 ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
        >
            <span className="font-bold text-black dark:text-gray-200">B</span>
        </Button>

        <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`border border-gray-300 dark:border-gray-600 ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
        >
            <em className="text-black dark:text-gray-200">I</em>
        </Button>

        <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`border border-gray-300 dark:border-gray-600 ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
        >
            <span className="text-black dark:text-gray-200">List</span>
        </Button>

        <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`border border-gray-300 dark:border-gray-600 ${
            editor.isActive("heading", { level: 2 })
                ? "bg-gray-200 dark:bg-gray-700"
                : ""
            }`}
        >
            <span className="text-black dark:text-gray-200">H2</span>
        </Button>
        </div>

        {/* Editor content */}
        <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
        </div>

        {/* Save button */}
        <div className="flex justify-end border-t border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
        <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
        </Button>
        </div>
    </div>
    </div>
  );
};
