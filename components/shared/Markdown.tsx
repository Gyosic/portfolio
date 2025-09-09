"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className = "" }: MarkdownProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 이미지 최적화
          img: ({ src, alt, ...props }) => {
            if (!src) return null;

            // 배지 이미지인 경우 (shields.io, img.shields.io 등)
            if ((src as string).includes("shields.io") || (src as string).includes("badge")) {
              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="inline-block h-5 w-auto rounded border-0 shadow-sm transition-shadow hover:shadow-md"
                  {...props}
                />
              );
            }

            // 외부 이미지인 경우
            if ((src as string).startsWith("http")) {
              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="h-auto max-w-full rounded-lg shadow-md"
                  {...props}
                />
              );
            }

            // 로컬 이미지인 경우 Next.js Image 사용
            return (
              <Image
                src={src as string}
                alt={alt || ""}
                width={800}
                height={400}
                className="h-auto max-w-full rounded-lg shadow-md"
                unoptimized
              />
            );
          },

          // 코드 블록 하이라이팅
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !match;

            if (!isInline && language) {
              return (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={language}
                  PreTag="div"
                  className="rounded-lg"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800"
                {...props}
              >
                {children}
              </code>
            );
          },

          // 링크 스타일링
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-blue-600 hover:underline dark:text-blue-400"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),

          // 테이블 스타일링
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                {...props}
              >
                {children}
              </table>
            </div>
          ),

          th: ({ children, ...props }) => (
            <th
              className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold dark:border-gray-600 dark:bg-gray-800"
              {...props}
            >
              {children}
            </th>
          ),

          td: ({ children, ...props }) => (
            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600" {...props}>
              {children}
            </td>
          ),

          // 제목 스타일링
          h1: ({ children, ...props }) => (
            <h1 className="mb-4 font-bold text-3xl text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mb-3 font-semibold text-2xl text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-gray-100" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="mb-1 font-semibold text-base text-gray-900 dark:text-gray-100"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="mb-1 font-semibold text-gray-900 text-sm dark:text-gray-100" {...props}>
              {children}
            </h6>
          ),

          // 문단 스타일링
          p: ({ children, ...props }) => (
            <p className="mb-4 text-gray-700 leading-relaxed dark:text-gray-300" {...props}>
              {children}
            </p>
          ),

          // 리스트 스타일링
          ul: ({ children, ...props }) => (
            <ul className="mb-4 ml-6 list-disc text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="mb-1 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </li>
          ),

          // div 스타일링 (HTML 태그 지원)
          div: ({ children, className, ...props }) => {
            const align = (props as { align?: string }).align;
            const alignment =
              align === "center"
                ? "text-center"
                : align === "right"
                  ? "text-right"
                  : align === "left"
                    ? "text-left"
                    : "";

            return (
              <div className={`${alignment} ${className || ""}`} {...props}>
                {children}
              </div>
            );
          },

          // details/summary 스타일링 (접을 수 있는 섹션)
          details: ({ children, ...props }) => (
            <details
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              {...props}
            >
              {children}
            </details>
          ),

          summary: ({ children, ...props }) => (
            <summary
              className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
              {...props}
            >
              {children}
            </summary>
          ),

          // 인용구 스타일링
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-blue-500 border-l-4 pl-4 text-gray-700 italic dark:text-gray-300"
              {...props}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
