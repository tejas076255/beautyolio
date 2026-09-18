import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/site/logo";

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo size="sm" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Cover Banner Skeleton */}
        <div className="relative overflow-hidden rounded-3xl bg-muted">
          <Skeleton className="h-44 w-full sm:h-60" />
        </div>

        {/* Profile Info Header Skeleton */}
        <div className="relative -mt-16 mb-8 px-4 sm:-mt-20 sm:px-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left sm:gap-6">
            {/* Avatar Circle */}
            <Skeleton className="h-28 w-28 shrink-0 rounded-full border-4 border-background shadow-lg sm:h-36 sm:w-36" />

            {/* Profile Title & Badges */}
            <div className="mt-4 flex-1 space-y-2 sm:mt-0 sm:pb-2">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Skeleton className="h-8 w-48 rounded-lg sm:h-10 sm:w-64" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="mx-auto h-5 w-40 rounded sm:mx-0" />
              <Skeleton className="mx-auto h-4 w-56 rounded sm:mx-0" />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex w-full gap-3 sm:mt-0 sm:w-auto">
              <Skeleton className="h-11 flex-1 rounded-xl sm:w-32" />
              <Skeleton className="h-11 flex-1 rounded-xl sm:w-36" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-border">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* Content Section Skeletons */}
        <div className="space-y-10">
          {/* Services Grid Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-36 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-6 w-32 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="pt-2 flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Grid Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
