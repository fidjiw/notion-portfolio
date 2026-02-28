"use client";

import { Project } from "@/lib/notion";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onMouseEnter?: () => void;
  isDark: boolean;
}

export function ProjectCard({ project, onClick, onMouseEnter, isDark }: ProjectCardProps) {
  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 cursor-pointer group border ${
        isDark 
          ? 'bg-[#141414] border-[#262626] hover:border-[#404040]' 
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${
          isDark ? 'bg-[#1f1f1f]' : 'bg-gray-100'
        }`}>
          {project.icon}
        </div>
        {project.category && (
          <span className={`text-xs font-medium rounded px-2 py-0.5 tracking-wider uppercase border ${
            isDark ? 'text-[#888] border-[#333]' : 'text-gray-600 border-gray-300'
          }`}>
            {project.category}
          </span>
        )}
      </div>

      <h3 className={`font-semibold text-base leading-snug group-hover:text-gray-200 transition-colors ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {project.name}
      </h3>

      <p className={`text-sm leading-relaxed line-clamp-3 flex-1 ${
        isDark ? 'text-[#888]' : 'text-gray-600'
      }`}>
        {project.description}
      </p>

      <div className="flex items-center justify-between mt-1">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1.5 text-sm transition-colors z-10 ${
              isDark ? 'text-[#666] hover:text-[#aaa]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Source
          </a>
        ) : (
          <span />
        )}

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors z-10 ${
              isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Visit
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
