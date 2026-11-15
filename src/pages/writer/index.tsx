import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function WriterPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 11 : 6
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="内容工作室"
        description="调整语气，梳理思路，让每一句表达恰到好处。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="内容工作室视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '语气改写' },
            { value: 'resources', label: '内容与来源' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/apple-select" />
            <DemoCard name="avara/text-animation" />
            <DemoCard name="tone-rewrite" />
            <DemoCard name="prompt-suggestions" />
            <DemoCard name="response-feedback" />
          </>
        )}
        {(view === 'all' || view === 'resources') && (
          <>
            <DemoCard name="avara/folder" />
            <DemoCard name="avara/memories-card" />
            <DemoCard name="artifact-panel" />
            <DemoCard name="source-list" />
            <DemoCard name="result-carousel" />
            <DemoCard name="attachment-preview" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
