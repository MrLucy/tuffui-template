import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function AgentsPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 16 : view === 'runs' ? 9 : 7
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="智能体中心"
        description="让专业的 智能体各司其职，随时掌握每一步进展。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="智能体中心视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '所有智能体' },
            { value: 'runs', label: '运行与追踪' },
            { value: 'development', label: '开发工具' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {(view === 'all' || view === 'runs') && (
          <>
            <DemoCard name="avara/flowchart" />
            <DemoCard name="avara/infrastructure-topology" />
            <DemoCard name="avara/animated-list" />
            <DemoCard name="background-agents" />
            <DemoCard name="agent-console" wide />
            <DemoCard name="agent-question" />
            <DemoCard name="agent-status" />
            <DemoCard name="tool-call-graph" />
            <DemoCard name="run-trace" />
          </>
        )}
        {(view === 'all' || view === 'development') && (
          <>
            <DemoCard name="coding-agent" wide />
            <DemoCard name="file-changes" />
            <DemoCard name="checkpoint-timeline" />
            <DemoCard name="terminal-output" />
            <DemoCard name="code-block" />
            <DemoCard name="json-viewer" />
            <DemoCard name="blast-radius" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
