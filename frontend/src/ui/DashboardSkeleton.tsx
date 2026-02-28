interface SkeletonProps {
  quantity: number;
}

export default function DashboardSkeleton({quantity}: SkeletonProps) {
  const items = Array.from({ length: quantity });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className="group animate-pulse bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 shadow-xl"
        >
          <div className="flex justify-between items-center">
            <div className="mr-15">
              <div className="w-4 h-4 bg-slate-800 m-2 rounded-sm">
              </div>
              <div className="h-6 w-30 rounded-2xl bg-slate-800">
              </div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg text-sm font-bold text-slate-300">
              <p className="opacity-0">{"BTC"}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
