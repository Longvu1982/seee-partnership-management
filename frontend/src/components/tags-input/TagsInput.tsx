import type React from "react";

import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagsInput({
  tags = [],
  onChange,
  placeholder = "Add a tag...",
  maxTags,
}: TagsInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();

    // Validation
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) return;
    if (maxTags && tags.length >= maxTags) return;

    // Add the tag
    onChange([...tags, trimmedTag]);
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const newTags = pasted.split(/[,\s]+/).filter((t) => t.trim());
    newTags.forEach((tag) => addTag(tag));
  };

  return (
    <div className="w-full">
      <div className="border-input border rounded-md min-h-10 flex flex-col items-center justify-between px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 self-start">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full font-medium text-blue-700 dark:text-blue-300"
              >
                <span className="leading-[14px]">{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center -mb-0.5A"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <Input
          wrapperClassname="w-full"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            maxTags && tags.length >= maxTags ? "Max tags reached" : placeholder
          }
          disabled={maxTags ? tags.length >= maxTags : false}
          className="w-full focus-visible:ring-offset-0 focus-visible:ring-0 border-0 ring-0! outline-none p-0 h-fit"
        />
      </div>
    </div>
  );
}
