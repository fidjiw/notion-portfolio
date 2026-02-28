"use client";

import { useEffect } from "react";

interface Project {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  order: number;
}

interface ProjectModalProps {
  project: Project;
  pageContent: any[];
  onClose: () => void;
  isDark: boolean;
}

export function ProjectModal({ project, pageContent, onClose, isDark }: ProjectModalProps) {
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

  const renderBlock = (block: any) => {
    const type = block.type;
    const content = block[type];

    switch (type) {
      case "paragraph":
        const text = content.rich_text?.[0]?.plain_text || "";
        return text ? <p className={`leading-relaxed mb-4 ${isDark ? 'text-[#aaa]' : 'text-gray-600'}`}>{text}</p> : null;
      
      case "heading_1":
        return <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{content.rich_text?.[0]?.plain_text}</h1>;
      
      case "heading_2":
        return <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{content.rich_text?.[0]?.plain_text}</h2>;
      
      case "heading_3":
        return <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{content.rich_text?.[0]?.plain_text}</h3>;
      
      case "bulleted_list_item":
        return <li className={`ml-4 mb-2 list-disc ${isDark ? 'text-[#aaa]' : 'text-gray-600'}`}>{content.rich_text?.[0]?.plain_text}</li>;
      
      case "numbered_list_item":
        return <li className={`ml-4 mb-2 list-decimal ${isDark ? 'text-[#aaa]' : 'text-gray-600'}`}>{content.rich_text?.[0]?.plain_text}</li>;
      
      case "code":
        return (
          <pre className={`rounded-lg p-4 mb-4 overflow-x-auto border ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
            <code className={`text-sm ${isDark ? 'text-[#aaa]' : 'text-gray-700'}`}>{content.rich_text?.[0]?.plain_text}</code>
          </pre>
        );
      
      case "divider":
        return <hr className={`my-6 ${isDark ? 'border-[#262626]' : 'border-gray-200'}`} />;
      
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className={`rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border ${
        isDark ? 'bg-[#0a0a0a] border-[#262626]' : 'bg-white border-gray-200'
      }`}>
        <div className={`sticky top-0 px-6 py-4 flex items-center justify-between border-b ${
          isDark ? 'bg-[#0a0a0a] border-[#262626]' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'
            }`}>
              {project.icon}
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-[#666] hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
          <div>
            <div className="mb-6">
              {project.category && (
                <span className={`inline-block text-xs font-medium rounded px-3 py-1 tracking-wider uppercase mb-4 border ${
                  isDark ? 'text-[#888] border-[#333]' : 'text-gray-600 border-gray-300'
                }`}>
                  {project.category}
                </span>
              )}
              <p className={`text-base leading-relaxed whitespace-pre-wrap mb-6 ${
                isDark ? 'text-[#aaa]' : 'text-gray-600'
              }`}>
                {project.description}
              </p>
              
              <div className={`flex items-center gap-3 pb-6 border-b ${
                isDark ? 'border-[#262626]' : 'border-gray-200'
              }`}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm border ${
                      isDark ? 'bg-[#1a1a1a] border-[#333] text-white hover:bg-[#252525] hover:border-[#444]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
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
                      isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'
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

            {pageContent.length > 0 && (
              <div className="prose prose-invert max-w-none">
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
    </div>
  );
}
