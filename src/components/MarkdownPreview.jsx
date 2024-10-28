import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";

const MarkdownPreview = ({ markdown, isHtmlPreview }) => {
  return (
    <div className="w-1/2 p-4 border-l border-gray-300">
      <div
        id="preview-content"
        className="h-full bg-white p-4 shadow rounded overflow-auto"
      >
        {isHtmlPreview ? (
          <pre className="whitespace-pre-wrap text-xs">{markdown}</pre>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold my-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-semibold my-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-semibold my-2">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-xl font-semibold my-2">{children}</h4>
              ),
              p: ({ children }) => <p className="my-2">{children}</p>,
              a: ({ children, href }) => (
                <Link
                  to={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {children}
                </Link>
              ),
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                // Block code with syntax highlighting
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 text-red-500 p-1 rounded">
                    {children}
                  </code>
                );
              },
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
