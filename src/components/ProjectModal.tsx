"use client";

import { useEffect, useState } from "react";

interface Tag {
  name: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  order: number;
  tags: Tag[];
  status: string;
}

interface ProjectModalProps {
  project: Project;
  pageContent: any[];
  onClose: () => void;
  isDark: boolean;
  isLoading?: boolean;
}

const notionTagColorMap: Record<string, { dark: string; light: string }> = {
  gray: { dark: "bg-[#333] text-[#aaa]", light: "bg-gray-100 text-gray-600" },
  brown: { dark: "bg-[#4a3728] text-[#c9a87c]", light: "bg-amber-100 text-amber-700" },
  orange: { dark: "bg-[#5c3a1e] text-[#f99157]", light: "bg-orange-100 text-orange-700" },
  yellow: { dark: "bg-[#4a3a00] text-[#ffd866]", light: "bg-yellow-100 text-yellow-700" },
  green: { dark: "bg-[#1a3a2a] text-[#6fcf97]", light: "bg-green-100 text-green-700" },
  blue: { dark: "bg-[#1a2a4a] text-[#56b6c2]", light: "bg-blue-100 text-blue-700" },
  purple: { dark: "bg-[#2a1a4a] text-[#c678dd]", light: "bg-purple-100 text-purple-700" },
  pink: { dark: "bg-[#4a1a3a] text-[#f48fb1]", light: "bg-pink-100 text-pink-700" },
  red: { dark: "bg-[#4a1a1a] text-[#e06c75]", light: "bg-red-100 text-red-600" },
  default: { dark: "bg-[#1a1a1a] text-[#888]", light: "bg-gray-100 text-gray-500" },
};

const notionTextColorMap: Record<string, string> = {
  gray: "text-gray-500",
  brown: "text-amber-700",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  red: "text-red-500",
};

export function ProjectModal({ project, pageContent, onClose, isDark, isLoading = false }: ProjectModalProps) {
  const [openToggles, setOpenToggles] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleBlock = (blockId: string) => {
    setOpenToggles((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const renderRichText = (richText: any[]) => {
    if (!richText || richText.length === 0) return null;
    return richText.map((rt: any, i: number) => {
      const { plain_text, annotations = {}, href } = rt;
      let node: React.ReactNode = plain_text;

      const colorClass =
        annotations.color && annotations.color !== "default"
          ? (notionTextColorMap[annotations.color] ?? "")
          : "";

      if (annotations.code) {
        node = (
          <code
            key={i}
            className={`px-1.5 py-0.5 rounded text-sm font-mono ${
              isDark ? "bg-[#1a1a1a] text-[#e06c75]" : "bg-gray-100 text-red-500"
            }`}
          >
            {plain_text}
          </code>
        );
      } else {
        if (annotations.bold) node = <strong className="font-semibold">{node}</strong>;
        if (annotations.italic) node = <em>{node}</em>;
        if (annotations.strikethrough) node = <del>{node}</del>;
        if (annotations.underline) node = <u>{node}</u>;
        if (href) {
          node = (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {node}
            </a>
          );
        }
        node = <span key={i} className={colorClass}>{node}</span>;
      }

      return node;
    });
  };

  const renderBlock = (block: any): React.ReactNode => {
    const type = block.type;
    const content = block[type];
    if (!content) return null;

    switch (type) {
      case "paragraph": {
        const nodes = renderRichText(content.rich_text);
        if (!nodes || (content.rich_text || []).length === 0) return <div className="mb-4" />;
        return (
          <p className={`leading-relaxed mb-4 ${isDark ? "text-[#aaa]" : "text-gray-600"}`}>
            {nodes}
          </p>
        );
      }

      case "heading_1":
        return (
          <h1 className={`text-2xl font-bold mt-6 mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            {renderRichText(content.rich_text)}
          </h1>
        );

      case "heading_2":
        return (
          <h2 className={`text-xl font-semibold mt-5 mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            {renderRichText(content.rich_text)}
          </h2>
        );

      case "heading_3":
        return (
          <h3 className={`text-lg font-semibold mt-4 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {renderRichText(content.rich_text)}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li className={`ml-5 mb-1.5 list-disc leading-relaxed ${isDark ? "text-[#aaa]" : "text-gray-600"}`}>
            {renderRichText(content.rich_text)}
          </li>
        );

      case "numbered_list_item":
        return (
          <li className={`ml-5 mb-1.5 list-decimal leading-relaxed ${isDark ? "text-[#aaa]" : "text-gray-600"}`}>
            {renderRichText(content.rich_text)}
          </li>
        );

      case "code":
        return (
          <pre className={`rounded-lg p-4 mb-4 overflow-x-auto border ${isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-gray-50 border-gray-200"}`}>
            <code className={`text-sm font-mono ${isDark ? "text-[#aaa]" : "text-gray-700"}`}>
              {content.rich_text?.map((rt: any) => rt.plain_text).join("")}
            </code>
          </pre>
        );

      case "quote":
        return (
          <blockquote className={`border-l-4 pl-4 mb-4 italic ${isDark ? "border-[#444] text-[#888]" : "border-gray-300 text-gray-500"}`}>
            {renderRichText(content.rich_text)}
          </blockquote>
        );

      case "callout":
        return (
          <div className={`flex gap-3 p-4 rounded-lg mb-4 border ${isDark ? "bg-[#1a1a1a] border-[#333] text-[#aaa]" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
            {content.icon?.emoji && <span className="text-xl shrink-0">{content.icon.emoji}</span>}
            <div>{renderRichText(content.rich_text)}</div>
          </div>
        );

      case "divider":
        return <hr className={`my-6 ${isDark ? "border-[#262626]" : "border-gray-200"}`} />;

      case "image": {
        const url = content.type === "external" ? content.external?.url : content.file?.url;
        return url ? (
          <img src={url} alt={content.caption?.[0]?.plain_text || ""} className="rounded-lg mb-4 max-w-full" />
        ) : null;
      }

      case "toggle": {
        const isOpen = openToggles.has(block.id);
        const children: any[] = block.children || [];
        return (
          <div className="mb-3">
            <button
              onClick={() => toggleBlock(block.id)}
              className={`flex items-center gap-2 w-full text-left font-medium transition-colors ${
                isDark ? "text-white hover:text-[#ccc]" : "text-gray-900 hover:text-gray-600"
              }`}
            >
              <svg
                className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{renderRichText(content.rich_text)}</span>
            </button>
            {isOpen && children.length > 0 && (
              <div className={`ml-6 mt-2 pl-4 border-l ${isDark ? "border-[#333]" : "border-gray-200"}`}>
                {children.map((child: any, i: number) => (
                  <div key={child.id || i}>{renderBlock(child)}</div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "bookmark": {
        const url = content.url;
        if (!url) return null;
        const caption = content.caption?.[0]?.plain_text;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-lg mb-4 border transition-colors ${
              isDark
                ? "bg-[#1a1a1a] border-[#333] hover:border-[#555] text-[#aaa]"
                : "bg-gray-50 border-gray-200 hover:border-gray-400 text-gray-600"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm truncate">{caption || url}</span>
          </a>
        );
      }

      case "table": {
        const rows: any[] = block.children || [];
        const hasColumnHeader = content.has_column_header;
        if (rows.length === 0) return null;
        return (
          <div className="overflow-x-auto mb-4">
            <table className={`w-full border-collapse text-sm border ${isDark ? "border-[#333]" : "border-gray-200"}`}>
              <tbody>
                {rows.map((row: any, rowIndex: number) => {
                  const cells: any[][] = row.table_row?.cells || [];
                  const isHeader = hasColumnHeader && rowIndex === 0;
                  const Tag = isHeader ? "th" : "td";
                  return (
                    <tr key={row.id || rowIndex} className={isDark ? "border-b border-[#333]" : "border-b border-gray-200"}>
                      {cells.map((cell: any[], cellIndex: number) => (
                        <Tag
                          key={cellIndex}
                          className={`px-4 py-2 text-left border-r last:border-r-0 ${
                            isDark
                              ? `border-[#333] ${isHeader ? "text-white font-semibold bg-[#1a1a1a]" : "text-[#aaa]"}`
                              : `border-gray-200 ${isHeader ? "text-gray-900 font-semibold bg-gray-50" : "text-gray-600"}`
                          }`}
                        >
                          {renderRichText(cell)}
                        </Tag>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`rounded-2xl w-full max-w-3xl shadow-2xl border flex flex-col ${
          isDark ? "bg-[#0a0a0a] border-[#262626]" : "bg-white border-gray-200"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className={`shrink-0 px-6 py-4 flex items-center justify-between border-b ${
          isDark ? "border-[#262626]" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl shrink-0 ${
              isDark ? "bg-[#1a1a1a]" : "bg-gray-100"
            }`}>
              {project.icon}
            </div>
            <div className="min-w-0">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {project.name}
              </h2>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.tags.map((tag) => {
                    const colors = notionTagColorMap[tag.color] ?? notionTagColorMap.default;
                    return (
                      <span
                        key={tag.name}
                        className={`text-xs rounded-full px-2 py-0.5 ${isDark ? colors.dark : colors.light}`}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors shrink-0 ml-4 ${
              isDark ? "text-[#666] hover:text-white hover:bg-[#1a1a1a]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {/* Category + Description + Links */}
          <div className="mb-6">
            {project.category && (
              <span className={`inline-block text-xs font-medium rounded px-3 py-1 tracking-wider uppercase mb-4 border ${
                isDark ? "text-[#888] border-[#333]" : "text-gray-600 border-gray-300"
              }`}>
                {project.category}
              </span>
            )}
            <p className={`text-base leading-relaxed whitespace-pre-wrap mb-6 ${
              isDark ? "text-[#aaa]" : "text-gray-600"
            }`}>
              {project.description}
            </p>

            <div className={`flex items-center gap-3 pb-6 border-b ${
              isDark ? "border-[#262626]" : "border-gray-200"
            }`}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm border ${
                    isDark
                      ? "bg-[#1a1a1a] border-[#333] text-white hover:bg-[#252525] hover:border-[#444]"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  查看源码
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    isDark ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  访问项目
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Loading skeleton */}
          {isLoading && pageContent.length === 0 && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-full animate-pulse ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}
                  style={{ width: ["90%", "75%", "85%", "60%"][i] }}
                />
              ))}
            </div>
          )}

          {/* Notion page content */}
          {pageContent.length > 0 && (
            <div>
              {pageContent.map((block, index) => (
                <div key={block.id || index}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
