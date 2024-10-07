import React from "react";

const MarkdownEditor = ({ markdown, onMarkdownChange }) => {
  return (
    <div className="w-1/2 p-4">
      <textarea
        className="w-full h-full border border-gray-300 p-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
        placeholder="Write your markdown here..."
      />
    </div>
  );
};

export default MarkdownEditor;
