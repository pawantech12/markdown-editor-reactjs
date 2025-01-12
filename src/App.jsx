import React, { useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";
import { PiExport, PiExportBold } from "react-icons/pi";
import { LuImport } from "react-icons/lu";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [documentName, setDocumentName] = useState("Untitled.md");
  const [isHtmlPreview, setIsHtmlPreview] = useState(false);

  const [lastSavedName, setLastSavedName] = useState(""); // Track last saved document name

  const handleMarkdownChange = (value) => {
    setMarkdown(value);
  };

  const handleDownload = (format) => {
    if (format === "markdown") {
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, documentName);
    }
  };

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => setMarkdown(event.target.result);
    reader.readAsText(e.target.files[0]);
  };

  // Function to count lines, words, and characters
  const countMarkdownStats = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== ""); // Filter out empty lines
    const words = text.split(/\s+/).filter((word) => word.length > 0); // Filter out empty strings
    const characters = text.length; // Total character count

    return {
      lineCount: lines.length,
      wordCount: words.length,
      charCount: characters,
    };
  };

  const { lineCount, wordCount, charCount } = countMarkdownStats(markdown);

  return (
    <div className="h-screen flex ">
      <div className={`flex flex-col flex-grow `}>
        <header className="flex justify-between items-center px-4 mt-4 ">
          <div className="flex items-center gap-4">
            <input
              className="bg-transparent border border-gray-200 py-2 px-3 rounded-md focus:outline-none"
              value={documentName}
              onChange={(e) => {
                setDocumentName(e.target.value);
                // Update last saved name when the document name changes
              }}
            />
            <button
              className="bg-neutral-700 hover:bg-neutral-950 text-white font-medium text-base py-2 px-4 rounded-md"
              onClick={() => {
                setLastSavedName(documentName);
              }}
            >
              Save
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDownload("markdown")}
              className="flex items-center gap-1 border border-gray-200  text-neutral-700 font-semibold py-2 px-4 rounded-md hover:bg-neutral-700 hover:text-white transition-colors duration-200 ease-in-out"
            >
              <FiDownload />
              Download
            </button>

            <input
              type="file"
              onChange={handleImport}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-1 border border-gray-200  text-neutral-700 font-semibold py-2 px-4 rounded-md hover:bg-neutral-700 hover:text-white transition-colors duration-200 ease-in-out cursor-pointer"
            >
              <LuImport className="w-5 h-5" />
              Import
            </label>
          </div>
        </header>
        <hr className="mt-4" />
        <div className="flex flex-grow px-2 mt-2">
          <MarkdownEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
          />

          <MarkdownPreview
            markdown={markdown}
            isHtmlPreview={isHtmlPreview}
            setIsHtmlPreview={setIsHtmlPreview}
          />
        </div>
        {/* Display stats at the bottom */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
          <p className="text-base border border-gray-200 rounded-md px-2 py-1">
            Lines: {lineCount}
          </p>
          <p className="text-base border border-gray-200 rounded-md px-2 py-1">
            Words: {wordCount}
          </p>
          <p className="text-base border border-gray-200 rounded-md px-2 py-1">
            Characters: {charCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
