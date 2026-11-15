import { useState } from 'react'

import { BentoGrid } from '@/components/studio/bento-grid'
import { DemoCard } from '@/components/studio/demo-card'
import { ExportButton } from '@/components/studio/export-button'
import { PageHeading } from '@/components/studio/page-heading'
import { Segmented } from '@/components/ui/segmented-control'

export function ChatPage() {
  const [view, setView] = useState('all')
  const count = view === 'all' ? 16 : 11
  return (
    <div className="page-content">
      <PageHeading
        eyebrow="工作空间 · 功能演示"
        title="智能对话"
        description="提一个好问题，和你的 AI 伙伴一起把想法向前推进。"
      >
        <ExportButton />
        <span className="demo-label">交互模拟</span>
      </PageHeading>
      <div className="feature-toolbar">
        <Segmented
          label="智能对话视图"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'all', label: '智能助手' },
            { value: 'tools', label: '对话工具' },
          ]}
        />
        <span className="tiny-note">{count} 个组合组件</span>
      </div>
      <BentoGrid className="feature-grid">
        {view === 'all' && (
          <>
            <DemoCard name="avara/conversation-timeline" />
            <DemoCard name="ai-chat" wide />
            <DemoCard name="chat-thread" />
            <DemoCard name="streaming-message" />
            <DemoCard name="user-message" />
          </>
        )}
        {(view === 'all' || view === 'tools') && (
          <>
            <DemoCard name="avara/avatar-stack" />
            <DemoCard name="avara/copy-button" />
            <DemoCard name="conversation-list" />
            <DemoCard name="message-branches" />
            <DemoCard name="agent-composer" />
            <DemoCard name="prompt-suggestions" />
            <DemoCard name="source-list" />
            <DemoCard name="response-feedback" />
            <DemoCard name="attachment-preview" />
            <DemoCard name="context-window-meter" />
            <DemoCard name="memory-panel" />
          </>
        )}
      </BentoGrid>
    </div>
  )
}
