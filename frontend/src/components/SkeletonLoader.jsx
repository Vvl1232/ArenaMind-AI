

const SkeletonLoader = () => {
  return (
    <div className="w-full h-full min-h-screen bg-bg-primary p-6 animate-pulse" aria-label="Loading content..." role="status">
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="h-12 bg-bg-card rounded-xl w-1/3 mb-4 border border-white/5"></div>
        
        {/* Top Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-bg-card rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-8 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Main Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="col-span-1 lg:col-span-2 h-96 bg-bg-card rounded-2xl border border-white/5 p-6">
            <div className="h-6 bg-white/10 rounded w-1/4 mb-6"></div>
            <div className="h-full bg-white/5 rounded-xl"></div>
          </div>
          <div className="col-span-1 h-96 bg-bg-card rounded-2xl border border-white/5 p-6 flex flex-col space-y-4">
             <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="h-10 bg-white/5 rounded-lg w-full"></div>
             ))}
          </div>
        </div>
        <span className="sr-only">Loading StadiumPilot AI...</span>
      </div>
    </div>
  );
};

export default SkeletonLoader;
