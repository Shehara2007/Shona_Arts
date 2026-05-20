import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-red-100/70 dark:bg-white/10', className)} />;
}

export function GallerySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-red-100 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <Skeleton className="mt-5 h-11 w-full" />
        </div>
      ))}
    </div>
  );
}
