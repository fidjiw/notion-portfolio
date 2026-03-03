"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  createdTime: string;
  lastEditedTime: string;
}

interface ProjectsViewProps {
  initialProjects: Project[];
}

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [categories] = useState<string[]>(() => {
    return Array.from(new Set(initialProjects.map((p) => p.category).filter(Boolean)));
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectContents, setProjectContents] = useState<Record<string, any[]>>({});
  const [loadingProjects, setLoadingProjects] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(true);
  const [sortOption, setSortOption] = useState<"order" | "latest" | "hot">("order");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);
  // 页面加载后后台预加载所有项目详情，点开时立即显示
  useEffect(() => {
    // 并行拉取所有项目详情
    Promise.all(
      initialProjects.map(async (project) => {
        setLoadingProjects(prev => new Set(prev).add(project.id));
        try {
          const res = await fetch(`/api/project/${project.id}`);
          const data = await res.json();
          setProjectContents(prev => ({
            ...prev,
            [project.id]: data.blocks || []
          }));
        } catch {
          // silent fail
        } finally {
          setLoadingProjects(prev => {
            const next = new Set(prev);
            next.delete(project.id);
            return next;
          });
        }
      })
    );
  }, [initialProjects]);

  const preloadProject = useCallback(async (projectId: string) => {
    if (projectContents[projectId] || loadingProjects.has(projectId)) return;

    setLoadingProjects(prev => new Set(prev).add(projectId));
    try {
      const res = await fetch(`/api/project/${projectId}`);
      const data = await res.json();
      setProjectContents(prev => ({
        ...prev,
        [projectId]: data.blocks || []
      }));
    } catch (error) {
      console.error(`Failed to preload project ${projectId}`);
    } finally {
      setLoadingProjects(prev => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  }, [projectContents, loadingProjects]);

  const getCategoryCount = (category: string) => {
    if (category === "ALL") return projects.length;
    return projects.filter((p) => p.category === category).length;
  };

  // 从 blocks 中提取可搜索文本
  const extractBlockText = (blocks: any[]): string => {
    const extractRichText = (richText: any[]): string => {
      if (!richText) return "";
      return richText.map((rt: any) => rt.plain_text || "").join("");
    };

    const extractBlock = (block: any): string => {
      const type = block.type;
      const content = block[type];
      if (!content) return "";

      let text = "";

      // 提取 rich_text
      if (content.rich_text) {
        text += extractRichText(content.rich_text) + " ";
      }
      // 提取 caption
      if (content.caption) {
        text += extractRichText(content.caption) + " ";
      }

      // 处理表格 - 提取所有行的单元格内容
      if (type === "table" && block.children) {
        block.children.forEach((row: any) => {
          if (row.table_row?.cells) {
            row.table_row.cells.forEach((cell: any[]) => {
              text += extractRichText(cell) + " ";
            });
          }
        });
      }

      // 递归处理子 blocks (toggle 等)
      if (block.children) {
        text += extractBlockText(block.children);
      }

      return text;
    };

    return blocks.map(extractBlock).join(" ").toLowerCase();
  };

  const filteredProjects = projects
    .filter((p) => selectedCategory === "ALL" || p.category === selectedCategory)
    .filter((p) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      // 搜索项目名称、描述、以及详情页内容
      const detailContent = projectContents[p.id];
      const detailText = detailContent ? extractBlockText(detailContent) : "";
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        detailText.includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "latest":
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
        case "hot":
          return new Date(b.lastEditedTime).getTime() - new Date(a.lastEditedTime).getTime();
        case "order":
        default:
          return a.order - b.order;
      }
    });

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <main className={isDark ? "min-h-screen px-4 py-12" : "min-h-screen px-4 py-12 bg-gray-50"}>
      <header className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              X
            </div>
            <div>
              <div className={`font-semibold text-xl ${isDark ? "text-white" : "text-gray-900"}`}>Fidjiw</div>
              <div className={isDark ? "text-[#888] text-sm" : "text-gray-600 text-sm"}>独立开发者 & Vibe Coder</div>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "bg-[#1a1a1a] text-[#aaa] hover:text-white border border-[#333]"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-300"
            }`}
            title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <h1 className={`text-2xl font-bold leading-relaxed mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          致力于用 AI 构建实用的 Web 应用<br />
          这里记录我的项目与创意
        </h1>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
            isDark
              ? "bg-[#1a1a1a] border border-[#262626] text-[#aaa]"
              : "bg-white border border-gray-300 text-gray-600"
          }`}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Building cool AI stuffs...
          </span>

          <a
            href="https://github.com/fidjiw"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${isDark ? "text-[#666] hover:text-[#aaa]" : "text-gray-500 hover:text-gray-700"}`}
            title="GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索项目名称、描述或详情内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-lg px-4 py-2.5 pl-10 focus:outline-none transition-colors ${
              isDark
                ? "bg-[#1a1a1a] border border-[#333] text-white placeholder-[#666] focus:border-[#555]"
                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400"
            }`}
          />
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-[#666]" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "ALL"
                ? isDark ? "bg-white text-black" : "bg-gray-900 text-white"
                : isDark
                  ? "bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400"
            }`}
          >
            ALL ({getCategoryCount("ALL")})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? isDark ? "bg-white text-black" : "bg-gray-900 text-white"
                  : isDark
                    ? "bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400"
              }`}
            >
              {cat} ({getCategoryCount(cat)})
            </button>
          ))}
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "order" | "latest" | "hot")}
          className={`px-3 py-1.5 rounded-lg text-sm border focus:outline-none ${
            isDark
              ? "bg-[#1a1a1a] border-[#333] text-[#aaa] focus:border-[#555]"
              : "bg-white border-gray-300 text-gray-600 focus:border-gray-400"
          }`}
        >
          <option value="order">默认顺序</option>
          <option value="latest">最新创建</option>
          <option value="hot">最近更新</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className={`text-center py-20 ${isDark ? "text-[#555]" : "text-gray-400"}`}>
          <div className="text-4xl mb-4">🔍</div>
          <p>{searchQuery ? "未找到匹配的项目" : "暂无项目"}</p>
        </div>
      ) : (
        <ErrorBoundary isDark={isDark}>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProjectId(project.id)}
                onMouseEnter={() => preloadProject(project.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </ErrorBoundary>
      )}

      <footer className={`max-w-[1400px] mx-auto mt-16 text-center text-sm ${isDark ? "text-[#444]" : "text-gray-500"}`}>
        <p>Data synced from Notion · Updates every 60s</p>
      </footer>

      {selectedProject && (
        <ErrorBoundary isDark={isDark}>
          <ProjectModal
            project={selectedProject}
            pageContent={projectContents[selectedProject.id] || []}
            isLoading={loadingProjects.has(selectedProject.id)}
            onClose={() => setSelectedProjectId(null)}
            isDark={isDark}
          />
        </ErrorBoundary>
      )}
    </main>
  );
}
