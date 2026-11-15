import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-start gap-6">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">页面不存在</h1>
      <Button asChild>
        <Link to="/">返回首页</Link>
      </Button>
    </section>
  )
}
