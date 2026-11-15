import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function EvaluationsPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 10 : view === 'reports' ? 4 : 2
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="模型评测"
        description="在同一条起跑线上，找到最适合你的模型。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="模型评测视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '实时评测' },
            { value: 'reports', label: '质量报告' },
            { value: 'releases', label: '发布记录' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/progress" />
            <DemoCard name="eval-race" />
            <DemoCard name="lap-timer" />
            <DemoCard name="match-field" />
          </>
        )}
        {(view === 'all' || view === 'reports') && (
          <>
            <DemoCard name="avara/half-stars" />
            <DemoCard name="eval-results" />
            <DemoCard name="radar-chart" />
            <DemoCard name="dot-histogram" />
          </>
        )}
        {(view === 'all' || view === 'releases') && (
          <>
            <DemoCard name="avara/animated-timeline" />
            <DemoCard name="deploy-timeline" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
