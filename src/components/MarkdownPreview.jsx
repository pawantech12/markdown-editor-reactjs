import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { LuClipboard, LuClipboardCheck } from "react-icons/lu";
import { useState } from "react";

const MarkdownPreview = ({ markdown, isHtmlPreview, setIsHtmlPreview }) => {
  const [isCopied, setIsCopied] = useState(false); // State to manage the copy status

  const handleCopy = () => {
    // Copy markdown content to the clipboard
    navigator.clipboard.writeText(markdown).then(() => {
      setIsCopied(true); // Set the copied status to true
      setTimeout(() => {
        setIsCopied(false); // Reset the copied status after 2 seconds
      }, 2000);
    });
  };
  return (
    <div className=" w-1/2 p-2 ">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsHtmlPreview(false)}
          className={`transition-colors ease-in-out duration-200 ${
            isHtmlPreview === true ? "text-neutral-800" : "text-emerald-500"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setIsHtmlPreview(true)}
          className={`transition-colors ease-in-out duration-200 ${
            isHtmlPreview === false ? "text-neutral-800" : "text-emerald-500"
          }`}
        >
          Raw
        </button>
      </div>
      <div
        id="preview-content"
        className="h-[450px] bg-white p-4 shadow rounded overflow-auto border border-gray-300 mt-1"
      >
        {isHtmlPreview ? (
          <pre className="whitespace-pre-wrap text-sm relative">
            {markdown}
            <button
              className="absolute top-0 right-0 hover:text-emerald-500 transition-colors ease-in-out duration-200"
              onClick={handleCopy}
            >
              {isCopied ? (
                <LuClipboardCheck className="w-6 h-6 text-emerald-500" />
              ) : (
                <LuClipboard className="w-6 h-6" />
              )}
            </button>
          </pre>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-[2em] text-[#24292e] font-semibold mt-[24px] mb-[16px] border-b pb-[.3rem] border-[#eaecef]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[1.5em] text-[#24292e] mt-[24px] mb-[16px] font-semibold pb-[.3rem] border-b border-[#eaecef]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[1.2em] mt-[24px] mb-[16px] text-[#24292e] font-semibold pb-[.3rem] border-b border-[#eaecef]">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-[1em] text-[#24292e]  mt-[24px] mb-[16px] font-semibold pb-[.3rem] border-b border-[#eaecef]">
                  {children}
                </h4>
              ),
              p: ({ children }) => <p className="mb-[16px]">{children}</p>,
              a: ({ children, href }) => (
                <Link
                  to={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0366d6] hover:underline"
                >
                  {children}
                </Link>
              ),
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                // Block code with syntax highlighting
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomOneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 text-[#24292e] p-1 rounded">
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => (
                <ul className="list-disc ml-6 flex flex-col gap-[.25em]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-6 flex flex-col gap-[.25em]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className=" text-[#24292e]">{children}</li>
              ),
              table: ({ children }) => (
                <table className="w-full border-collapse border border-gray-300 mt-4">
                  {children}
                </table>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100 border-b border-gray-300">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => (
                <tr className="border-b border-gray-300">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left font-semibold border border-gray-300 bg-gray-100">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border border-gray-300">{children}</td>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
