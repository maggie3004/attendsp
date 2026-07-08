import React from 'react'

export function SkeletonLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full shimmer" />
          <div className="flex-1">
            <div className="h-4 w-1/3 rounded shimmer mb-2" />
            <div className="h-3 w-1/2 rounded shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}
