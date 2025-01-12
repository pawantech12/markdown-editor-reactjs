import React from "react";

const MarkdownEditor = ({ markdown, onMarkdownChange }) => {
  return (
    <div className="w-1/2 p-2 ">
      <h4 className="text-neutral-700 font-semibold">Editor</h4>
      <textarea
        className="w-full h-[450px] border border-gray-300 p-4 rounded shadow focus:outline-none resize-none focus:ring-2 focus:ring-neutral-700 mt-2"
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
        placeholder="Write your markdown here..."
      />
    </div>
  );
};

export default MarkdownEditor;
