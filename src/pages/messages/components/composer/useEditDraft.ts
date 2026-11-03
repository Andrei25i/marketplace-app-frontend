import type { ChatMessage } from "@/types/chat.type";
import { useEffect, useRef, useState } from "react";

const useEditDraft = (editing: ChatMessage | null) => {
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentEditId = editing?.id ?? null;
  if (currentEditId !== editingId) {
    setEditingId(currentEditId);

    if (editing) {
      if (editingId === null) setDraft(value);
      setValue(editing.content ?? "");
    } else {
      setValue(draft);
      setDraft("");
    }
  }

  useEffect(() => {
    if (currentEditId) textareaRef.current?.focus();
  }, [currentEditId]);

  return { value, setValue, textareaRef };
};

export default useEditDraft;
