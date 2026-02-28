export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#1f1f1f]" />
        <div className="h-5 w-16 bg-[#1f1f1f] rounded" />
      </div>
      <div className="h-5 bg-[#1f1f1f] rounded w-3/4" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-[#1f1f1f] rounded" />
        <div className="h-4 bg-[#1f1f1f] rounded w-5/6" />
        <div className="h-4 bg-[#1f1f1f] rounded w-4/6" />
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="h-4 w-16 bg-[#1f1f1f] rounded" />
        <div className="h-8 w-20 bg-[#1f1f1f] rounded-lg" />
      </div>
    </div>
  );
}
