import React, { useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FiMenu } from "react-icons/fi";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [documentName, setDocumentName] = useState("Untitled.md");
  const [isHtmlPreview, setIsHtmlPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    } else if (format === "pdf") {
      const pdf = new jsPDF();
      const content = document.querySelector("#preview-content");
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10);
        pdf.save(`${documentName.replace(".md", "")}.pdf`);
      });
    }
  };

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => setMarkdown(event.target.result);
    reader.readAsText(e.target.files[0]);
  };

  const saveToHistory = () => {
    // Check if the document name already exists in history
    const existingDocIndex = history.findIndex(
      (doc) => doc.name === documentName
    );

    if (existingDocIndex !== -1) {
      // If it exists, update the content of the existing document
      const updatedHistory = [...history];
      updatedHistory[existingDocIndex] = {
        name: documentName,
        content: markdown,
      };
      setHistory(updatedHistory);
    } else {
      // If the document name doesn't exist, save as a new document
      setHistory([...history, { name: documentName, content: markdown }]);
    }
    setLastSavedName(documentName); // Update last saved name
  };

  const loadFromHistory = (doc) => {
    setDocumentName(doc.name);
    setMarkdown(doc.content);
    setIsSidebarOpen(false);
    setLastSavedName(doc.name); // Update last saved name when loading from history
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
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar with transition */}
      <aside
        className={`transform top-0 left-0 h-full bg-gray-200 p-4 shadow-lg fixed transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"
        }`}
        style={{
          visibility: isSidebarOpen ? "visible" : "hidden",
          pointerEvents: isSidebarOpen ? "auto" : "none", // Disable pointer events when closed
        }}
      >
        <h2 className="text-lg font-semibold mb-2">Document History</h2>
        <ul className="space-y-2">
          {history.map((doc, index) => (
            <li key={index}>
              <button
                className="w-full text-left text-blue-500 hover:underline"
                onClick={() => loadFromHistory(doc)}
              >
                {doc.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={saveToHistory}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Save to History
        </button>
      </aside>

      <div
        className={`flex flex-col flex-grow ${isSidebarOpen ? "ml-64" : ""}`}
      >
        <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FiMenu size={24} />
            </button>
            <input
              className="bg-transparent border-b border-white p-1 text-lg focus:outline-none"
              value={documentName}
              onChange={(e) => {
                setDocumentName(e.target.value);
                // Update last saved name when the document name changes
                setLastSavedName(e.target.value);
              }}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDownload("markdown")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Markdown
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Export PDF
            </button>
            <input
              type="file"
              onChange={handleImport}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Import Markdown
            </label>
            <button
              onClick={() => setIsHtmlPreview(!isHtmlPreview)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Toggle HTML Preview
            </button>
          </div>
        </header>
        <div className="flex flex-grow">
          <MarkdownEditor
            markdown={markdown}
            onMarkdownChange={handleMarkdownChange}
          />
          <MarkdownPreview markdown={markdown} isHtmlPreview={isHtmlPreview} />
        </div>
        {/* Display stats at the bottom */}
        <div className="p-4 bg-gray-200">
          <p>Lines: {lineCount}</p>
          <p>Words: {wordCount}</p>
          <p>Characters: {charCount}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
