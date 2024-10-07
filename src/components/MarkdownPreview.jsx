import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

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
            children={markdown} // Make sure 'markdown' is a string
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
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
              h5: ({ children }) => (
                <h5 className="text-lg font-semibold my-2">{children}</h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-base font-semibold my-2">{children}</h6>
              ),
              p: ({ children }) => <p className="my-2">{children}</p>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 my-2">{children}</ul>
              ),
              li: ({ children }) => <li className="my-1">{children}</li>,
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).trim()}{" "}
                    {/* Ensure children are treated as a string */}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {String(children).trim()}{" "}
                    {/* Ensure children are treated as a string */}
                  </code>
                );
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
