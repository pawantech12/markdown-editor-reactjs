import React, { useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [documentName, setDocumentName] = useState("Untitled.md");
  const [isHtmlPreview, setIsHtmlPreview] = useState(false);

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <input
          className="bg-transparent border-b border-white p-1 text-lg focus:outline-none"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />
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
    </div>
  );
}

export default App;
