"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskItemSkeleton() {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-[40%]">
            <Skeleton className="h-5 w-[200px]" />
          </div>
          <div className="flex items-center space-x-8">
            {/* Date skeleton */}
            <Skeleton className="h-8 w-[120px]" />

            {/* Project name skeleton */}
            <Skeleton className="h-5 w-[100px]" />

            {/* Status badge skeleton */}
            <Skeleton className="h-6 w-[90px] rounded-full" />

            {/* Avatar skeleton */}
            <Skeleton className="h-8 w-8 rounded-full" />

            {/* Delete button skeleton */}
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
