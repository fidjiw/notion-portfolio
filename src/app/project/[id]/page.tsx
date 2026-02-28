"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const found = data.projects.find((p: Project) => p.id === params.id);
        setProject(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-16 bg-[#1a1a1a] rounded mb-8 animate-pulse" />
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 mb-6 animate-pulse">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-[#1f1f1f]" />
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-[#1f1f1f] rounded w-1/2" />
                <div className="h-4 bg-[#1f1f1f] rounded w-3/4" />
                <div className="h-4 bg-[#1f1f1f] rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <div className="text-[#888]">项目不存在</div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-8 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-[#1f1f1f] flex items-center justify-center text-4xl flex-shrink-0">
              {project.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                {project.category && (
                  <span className="text-xs font-medium text-[#888] border border-[#333] rounded px-3 py-1 tracking-wider uppercase">
                    {project.category}
                  </span>
                )}
              </div>
              <p className="text-[#aaa] text-lg leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-[#262626]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:bg-[#252525] hover:border-[#444] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                访问项目
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-4">项目信息</h2>
          <div className="space-y-3 text-[#aaa]">
            <div className="flex items-center gap-2">
              <span className="text-[#666]">分类：</span>
              <span>{project.category || "未分类"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#666]">排序：</span>
              <span>#{project.order}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
