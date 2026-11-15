import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/loading-skeleton'
const AvaraDemo = lazy(() => import('./avara-demos'))
export function AvaraPreview({ name }: { name: string }) {
  return (
    <Suspense
      fallback={
        <div className="avara-loading" aria-label="正在加载交互组件">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-28 w-full" />
        </div>
      }
    >
      <AvaraDemo name={name} />
    </Suspense>
  )
}
