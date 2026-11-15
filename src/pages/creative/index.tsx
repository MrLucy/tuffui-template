import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'
import { avaraGroups, avaraNames } from '@/config/avara-catalog'

export function CreativePage() {
  const [view, setView] = useState('all')
  const components =
    view === 'tasks'
      ? avaraGroups['任务与协作']
      : view === 'resources'
        ? avaraGroups['创作与资源']
        : avaraNames

  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="创意交互"
        description="让两套组件在同一处协作，探索更有触感的任务与资源界面。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="创意交互视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '全部组合' },
            { value: 'tasks', label: '任务与协作' },
            { value: 'resources', label: '创作与资源' },
          ]}
        />
        <span className="tiny-note">{components.length} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {components.map((name) => (
          <DemoCard key={name} name={name} />
        ))}
      </BentoGrid>
    </div>
  )
}
