import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function ApprovalsPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 8 : 4
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="工具审批"
        description="看清每一次工具调用，让 智能体的下一步由你掌控。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="工具审批视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '审批队列' },
            { value: 'tools', label: '工具管理' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/secure-envelope" />
            <DemoCard name="avara/verify-badge" />
            <DemoCard name="tool-approval-queue" />
            <DemoCard name="confirmation-card" />
          </>
        )}
        {(view === 'all' || view === 'tools') && (
          <>
            <DemoCard name="tool-call-block" />
            <DemoCard name="mcp-servers" />
            <DemoCard name="blast-radius" />
            <DemoCard name="rate-limits" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
