// SkeletonLoader.js
import React, { memo } from 'react';

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col py-2 w-full gap-2">
        {[...Array(10)].map((i,ind)=><div key={ind} className="animate-pulse bg-gray-200 h-9 w-full rounded"></div>)}
    </div>
  );
};

export default memo(SkeletonLoader);
