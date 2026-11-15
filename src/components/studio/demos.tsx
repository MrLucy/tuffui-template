import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import * as ActionButtonUI from '@/components/ui/action-button'
import * as ActionMenuUI from '@/components/ui/action-menu'
import * as AgentAvatarUI from '@/components/ui/agent-avatar'
import * as AgentComposerUI from '@/components/ui/agent-composer'
import * as AgentConsoleUI from '@/components/ui/agent-console'
import * as AgentQuestionUI from '@/components/ui/agent-question'
import * as AgentStatusUI from '@/components/ui/agent-status'
import * as AiChatUI from '@/components/ui/ai-chat'
import * as ArtifactPanelUI from '@/components/ui/artifact-panel'
import * as AttachmentPreviewUI from '@/components/ui/attachment-preview'
import * as BackgroundAgentsUI from '@/components/ui/background-agents'
import * as BlastRadiusUI from '@/components/ui/blast-radius'
import * as BookingAssistantUI from '@/components/ui/booking-assistant'
import * as ChartCardUI from '@/components/ui/chart-card'
import * as ChatThreadUI from '@/components/ui/chat-thread'
import * as CheckpointTimelineUI from '@/components/ui/checkpoint-timeline'
import * as ChoiceControlsUI from '@/components/ui/choice-controls'
import * as ClausePlaybookUI from '@/components/ui/clause-playbook'
import * as CodeBlockUI from '@/components/ui/code-block'
import * as CodingAgentUI from '@/components/ui/coding-agent'
import * as ConfirmationCardUI from '@/components/ui/confirmation-card'
import * as ContextWindowMeterUI from '@/components/ui/context-window-meter'
import * as ConversationListUI from '@/components/ui/conversation-list'
import * as DataAnswerUI from '@/components/ui/data-answer'
import * as DataTableUI from '@/components/ui/data-table'
import * as DateFieldUI from '@/components/ui/date-field'
import * as DeliveryHeatmapUI from '@/components/ui/delivery-heatmap'
import * as DeployTimelineUI from '@/components/ui/deploy-timeline'
import * as DisclosureUI from '@/components/ui/disclosure'
import * as DivergingBarsUI from '@/components/ui/diverging-bars'
import * as DotHistogramUI from '@/components/ui/dot-histogram'
import * as DropZoneUI from '@/components/ui/drop-zone'
import * as EmptyStateUI from '@/components/ui/empty-state'
import * as EvalRaceUI from '@/components/ui/eval-race'
import * as EvalResultsUI from '@/components/ui/eval-results'
import * as FileChangesUI from '@/components/ui/file-changes'
import * as FormCardUI from '@/components/ui/form-card'
import * as HandoffInboxUI from '@/components/ui/handoff-inbox'
import * as HexDensityUI from '@/components/ui/hex-density'
import * as InboxCleanupUI from '@/components/ui/inbox-cleanup'
import * as IsoBarsUI from '@/components/ui/iso-bars'
import * as JsonViewerUI from '@/components/ui/json-viewer'
import * as KeyHintUI from '@/components/ui/key-hint'
import * as LapTimerUI from '@/components/ui/lap-timer'
import * as LoaderUI from '@/components/ui/loader'
import * as LoadingSkeletonUI from '@/components/ui/loading-skeleton'
import * as MatchFieldUI from '@/components/ui/match-field'
import * as McpServersUI from '@/components/ui/mcp-servers'
import * as MemoryPanelUI from '@/components/ui/memory-panel'
import * as MessageBranchesUI from '@/components/ui/message-branches'
import * as MessageLogUI from '@/components/ui/message-log'
import * as MirrorStripsUI from '@/components/ui/mirror-strips'
import * as ModalSheetUI from '@/components/ui/modal-sheet'
import * as PopoverPanelUI from '@/components/ui/popover-panel'
import * as ProgressBarUI from '@/components/ui/progress-bar'
import * as PromptSuggestionsUI from '@/components/ui/prompt-suggestions'
import * as RadarChartUI from '@/components/ui/radar-chart'
import * as RadialDotsUI from '@/components/ui/radial-dots'
import * as RangeSliderUI from '@/components/ui/range-slider'
import * as RateLimitsUI from '@/components/ui/rate-limits'
import * as RenewalRingsUI from '@/components/ui/renewal-rings'
import * as ResponseFeedbackUI from '@/components/ui/response-feedback'
import * as ResultCarouselUI from '@/components/ui/result-carousel'
import * as RollingNumberUI from '@/components/ui/rolling-number'
import * as RunTraceUI from '@/components/ui/run-trace'
import * as SegmentedControlUI from '@/components/ui/segmented-control'
import * as SelectFieldUI from '@/components/ui/select-field'
import * as SlotPickerUI from '@/components/ui/slot-picker'
import * as SourceListUI from '@/components/ui/source-list'
import * as StatGridUI from '@/components/ui/stat-grid'
import * as StatusPillUI from '@/components/ui/status-pill'
import * as StreamingMessageUI from '@/components/ui/streaming-message'
import * as SupportWidgetUI from '@/components/ui/support-widget'
import * as SurfaceUI from '@/components/ui/surface'
import * as TabPanelsUI from '@/components/ui/tab-panels'
import * as TerminalOutputUI from '@/components/ui/terminal-output'
import * as TextFieldUI from '@/components/ui/text-field'
import * as TickGaugeUI from '@/components/ui/tick-gauge'
import * as ToastStackUI from '@/components/ui/toast-stack'
import * as ToneRewriteUI from '@/components/ui/tone-rewrite'
import * as ToolApprovalQueueUI from '@/components/ui/tool-approval-queue'
import * as ToolCallBlockUI from '@/components/ui/tool-call-block'
import * as ToolCallGraphUI from '@/components/ui/tool-call-graph'
import * as TooltipHintUI from '@/components/ui/tooltip-hint'
import * as UsageSummaryUI from '@/components/ui/usage-summary'
import * as UserMessageUI from '@/components/ui/user-message'
import * as D from '@/data/studio'
import { notify } from '@/lib/notify'

export function RaceDemo({ compact = false }: { compact?: boolean }) {
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  return (
    <div className="race-demo">
      <EvalRaceUI.EvalRace
        title="模型评测赛道"
        subtitle="客户服务 · 基准评测 第 2.4 版"
        total={1000}
        perLap={200}
        racers={D.racers.map((r) => ({
          ...r,
          scored: Math.min(1000, r.scored + progress),
        }))}
        layout={compact ? 'standings' : 'race'}
        className="!max-w-none"
      />
      <div className="demo-actions">
        <span className="tiny-note">同一数据集，四个模型，实时比较。</span>
        <ActionButtonUI.Button
          onClick={() => {
            setProgress((p) => (p >= 420 ? 0 : p + 110))
            setRunning(true)
          }}
          variant="primary"
        >
          {progress >= 420 ? '重新评测' : running ? '推进评测' : '继续评测'}{' '}
          <ArrowUpRight size={13} />
        </ActionButtonUI.Button>
      </div>
    </div>
  )
}
export function RewriteDemo() {
  const [status, setStatus] = useState<'idle' | 'writing' | 'done'>('idle')
  const [output, setOutput] = useState('')
  return (
    <ToneRewriteUI.ToneRewrite
      source="我们希望通过更直观的工作台，让团队在一个地方完成模型评测、内容创作和工具审批，从而将更多时间投入到有价值的工作中。"
      attachment={{ name: '产品介绍.md', words: 142, origin: '工作空间' }}
      placeholder="描述你想如何改写这段文字…"
      models={[
        { value: 'sonnet', label: '云帆推理模型' },
        { value: 'gpt', label: '星河通用模型' },
      ]}
      labels={{
        formal: '正式',
        casual: '轻松',
        brief: '简短',
        detailed: '详细',
      }}
      status={status}
      output={output}
      onSend={(request) => {
        setStatus('writing')
        setTimeout(() => {
          setOutput(
            `${request.tone.x > 0 ? '把复杂的工作交给工作台，把时间留给好想法。' : '统一模型评测、内容创作与工具审批，让团队专注于更有价值的工作。'}${request.prompt ? `\n\n改写要求：${request.prompt}` : ''}`,
          )
          setStatus('done')
        }, 750)
      }}
      onStop={() => setStatus('idle')}
      onReplace={() => notify('已替换原文（模拟）')}
      onInsert={() => notify('已插入文档（模拟）')}
      className="!max-w-none"
    />
  )
}
function ChatDemo() {
  const [messages, setMessages] = useState(D.messages)
  return (
    <AiChatUI.AIChat
      data={{
        title: '研究助手',
        model: '云帆推理模型',
        conversations: [
          {
            id: 'conv1',
            title: '模型表现分析',
            updatedAt: '2026-11-14T10:24:00',
          },
        ],
        activeId: 'conv1',
        messages,
        starters: D.suggestions,
        context: D.context,
        user: { name: '陈明' },
      }}
      defaultSidebarOpen={false}
      onNewChat={() => setMessages([])}
      onSend={(text) =>
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            at: '2026-11-14T10:25:00+08:00',
          },
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `已收到「${text}」。这是静态演示回复：你可以在模型评测中比较模型表现，或在数据洞察中查看使用情况。`,
            at: '2026-11-14T10:25:00+08:00',
          },
        ])
      }
      className="!h-[620px] !max-w-none"
    />
  )
}
const tool = {
  id: 'tool1',
  name: '网页搜索',
  args: { 关键词: '智能工作台设计' },
  status: 'success' as const,
  durationMs: 820,
  result: { 找到结果: 12, 状态: '成功' },
}
const versions = [
  {
    id: 'v1',
    label: '初始版本',
    createdAt: '10:24',
    note: '初始版本',
    preview: (
      <div className="artifact-preview">
        <Sparkles size={28} />
        <h3>好想法，从这里开始。</h3>
        <p>你的团队，新的工作方式。</p>
      </div>
    ),
    source: '<h1>好想法，从这里开始。</h1>',
    filename: '产品预览.html',
  },
]
const points: [number, number][] = Array.from({ length: 180 }, (_, i) => [
  (i * 73) % 100,
  15 + ((i * 37) % 70),
])
const slotData = {
  title: '选择评测复盘时间',
  timeZone: { id: 'Asia/Shanghai', label: '北京时间', offset: 8 },
  slots: [
    {
      id: 'slot1',
      day: '2026-11-16',
      start: '10:00',
      end: '10:30',
      available: true,
    },
    {
      id: 'slot2',
      day: '2026-11-16',
      start: '14:00',
      end: '14:30',
      available: true,
    },
  ],
}
const demoMap: Record<string, () => ReactNode> = {
  'action-button': () => (
    <div className="flex flex-wrap gap-2">
      <ActionButtonUI.Button
        variant="primary"
        onClick={() => notify('已创建新任务')}
      >
        创建任务
      </ActionButtonUI.Button>
      <ActionButtonUI.Button onClick={() => notify('已保存草稿')}>
        保存草稿
      </ActionButtonUI.Button>
      <ActionButtonUI.Button
        variant="danger"
        onClick={() => notify('模拟任务已取消')}
      >
        取消任务
      </ActionButtonUI.Button>
    </div>
  ),
  'action-menu': () => (
    <ActionMenuUI.Menu
      trigger={<ActionButtonUI.Button>操作菜单 ···</ActionButtonUI.Button>}
      groups={[
        {
          items: [
            {
              id: 'copy',
              label: '复制链接',
              onSelect: () => notify('已复制模拟链接'),
            },
            {
              id: 'archive',
              label: '归档任务',
              onSelect: () => notify('已归档任务'),
            },
          ],
        },
      ]}
    />
  ),
  'agent-avatar': () => (
    <div className="flex items-center gap-4">
      <AgentAvatarUI.Avatar name="研究助手" status="working" size="lg" />
      <AgentAvatarUI.Avatar name="陈明" kind="person" status="online" />
      <AgentAvatarUI.AvatarGroup
        people={[
          { name: '陈明' },
          { name: '王莉' },
          { name: '宋宁' },
          { name: '林悦' },
        ]}
        max={3}
      />
    </div>
  ),
  'agent-composer': () => (
    <AgentComposerUI.AgentComposer
      placeholder="给你的智能体 一个任务…"
      models={[{ id: 'sonnet', name: '云帆推理模型' }]}
      allowAttachments={false}
      onSubmit={(m) => notify(`已提交模拟任务：${m.text}`)}
    />
  ),
  'agent-console': () => (
    <AgentConsoleUI.AgentConsole
      data={{
        title: '工作空间控制台',
        environment: '演示环境',
        team: [{ id: 'alex', name: '陈明' }],
        stats: D.stats,
        agents: D.agents,
        run: { name: '产品研究', spans: D.spans, elapsedMs: 4200 },
        evals: D.evalData,
        usage: D.usage,
        limits: D.limits,
        context: D.context,
      }}
      className="!max-w-none"
    />
  ),
  'agent-question': () => (
    <AgentQuestionUI.AgentQuestion
      agent="研究助手"
      data={{
        question: '本次报告需要重点分析哪个方向？',
        options: [
          {
            id: 'product',
            label: '产品体验',
            description: '关注功能、交互与使用流程',
          },
          {
            id: 'tech',
            label: '技术方案',
            description: '关注性能、成本与集成',
          },
        ],
        suggested: { optionId: 'product', reason: '根据当前项目目标推荐' },
      }}
      onSubmit={() => notify('偏好已提交')}
      onDelegate={() => notify('智能体已选择推荐方向')}
    />
  ),
  'agent-status': () => (
    <AgentStatusUI.AgentStatus
      data={{
        label: '研究报告已完成',
        detail: '已整理 12 份资料',
        startedAt: Date.now() - 3600,
        status: 'done',
        steps: [
          { id: '1', label: '检索资料', durationMs: 1200 },
          { id: '2', label: '生成报告', durationMs: 2400 },
        ],
      }}
    />
  ),
  'ai-chat': () => <ChatDemo />,
  'artifact-panel': () => (
    <ArtifactPanelUI.ArtifactPanel
      data={{ title: '产品介绍', kind: '网页', versions }}
    />
  ),
  'attachment-preview': () => (
    <AttachmentPreviewUI.AttachmentPreview
      data={[
        {
          id: '1',
          name: '产品研究.pdf',
          size: 245000,
          type: 'application/pdf',
          status: 'ready',
        },
        {
          id: '2',
          name: '评测数据.csv',
          size: 18200,
          type: 'text/csv',
          status: 'ready',
        },
      ]}
      onRemove={() => notify('附件已移除（模拟）')}
    />
  ),
  'background-agents': () => (
    <BackgroundAgentsUI.BackgroundAgents
      data={D.agents}
      onOpen={(a) => notify(`${a.name}：${a.task}`)}
      onPause={() => notify('已暂停模拟任务')}
      onResume={() => notify('已恢复模拟任务')}
      onReview={() => notify('请前往工具审批页查看请求')}
    />
  ),
  'blast-radius': () => (
    <BlastRadiusUI.BlastRadius
      title="工具访问范围"
      center={{ label: '研究助手', initials: '研' }}
      nodes={[
        { id: 'files', label: '项目文件', kind: 'resource', affected: true },
        { id: 'api', label: '搜索 API', kind: 'tool', affected: true },
        {
          id: 'report',
          label: '研究报告',
          kind: 'resource',
          parent: 'files',
          indirect: true,
        },
      ]}
    />
  ),
  'booking-assistant': () => (
    <BookingAssistantUI.BookingAssistant
      data={{
        title: '安排团队复盘',
        model: '云帆推理模型',
        messages: D.messages,
        summary: {
          title: '会议安排',
          items: [
            { id: '1', label: '主题', value: '模型评测复盘' },
            { id: '2', label: '时长', value: '30 分钟' },
          ],
        },
        user: { name: '陈明' },
      }}
      onSend={(t) => notify(`已收到安排：${t}`)}
    />
  ),
  'chart-card': () => (
    <ChartCardUI.ChartCard
      title="请求趋势"
      subtitle="过去 7 天"
      total="24,892"
      type="area"
      data={{ labels: D.labels, series: D.series }}
    />
  ),
  'chat-thread': () => (
    <ChatThreadUI.ChatThread
      data={{ messages: D.messages }}
      height={280}
      agentName="研究助手"
      userName="陈明"
    />
  ),
  'checkpoint-timeline': () => (
    <CheckpointTimelineUI.CheckpointTimeline
      data={D.checkpoints}
      onRestore={() => notify('已恢复模拟检查点')}
    />
  ),
  'choice-controls': () => (
    <div className="grid gap-4">
      <ChoiceControlsUI.Switch label="自动保存" defaultChecked />
      <ChoiceControlsUI.Checkbox label="运行完成后通知我" defaultChecked />
      <ChoiceControlsUI.RadioGroup label="运行模式" defaultValue="balanced">
        <ChoiceControlsUI.Radio value="balanced" label="均衡模式" />
        <ChoiceControlsUI.Radio value="fast" label="快速模式" />
      </ChoiceControlsUI.RadioGroup>
    </div>
  ),
  'clause-playbook': () => (
    <ClausePlaybookUI.ClausePlaybook
      clause="服务保障期"
      subtitle="合同条款 · 标准模板"
      distribution={Array.from({ length: 24 }, (_, i) => ({
        value: i + 1,
        count: 4 + ((i * 13) % 32),
      }))}
      domain={[0, 24]}
      unit="月"
      defaultThresholds={{ fallback: 8, preferred: 16 }}
      onApply={() => notify('条款偏好已保存')}
    />
  ),
  'code-block': () => (
    <CodeBlockUI.CodeBlock
      data={{
        filename: 'agent.config.ts',
        language: 'ts',
        code: 'export const agent = {\n  name: "研究助手",\n  model: "claude-sonnet",\n  tools: ["search", "read"],\n  maxSteps: 12,\n}',
      }}
    />
  ),
  'coding-agent': () => (
    <CodingAgentUI.CodingAgent
      data={{
        title: '构建紧凑工作台',
        repo: 'studio/workbench',
        branch: 'feat/dashboard',
        model: '云帆推理模型',
        user: { name: '陈明' },
        messages: D.messages,
        files: D.files,
        terminal: D.terminal,
        checkpoints: D.checkpoints,
        preview: { url: 'localhost:5180', content: versions[0].preview },
      }}
      onSend={(m) => notify(`已提交：${m.text}`)}
      onApply={() => notify('代码变更已应用（模拟）')}
    />
  ),
  'confirmation-card': () => <ConfirmationDemo />,
  'context-window-meter': () => (
    <ContextWindowMeterUI.ContextWindowMeter
      data={D.context}
      onCompact={() => notify('上下文已压缩（模拟）')}
    />
  ),
  'conversation-list': () => (
    <ConversationListUI.ConversationList
      data={[
        {
          id: '1',
          title: '模型表现分析',
          updatedAt: '2026-11-14T10:24:00',
          pinned: true,
        },
        { id: '2', title: '产品周报', updatedAt: '2026-11-13T15:00:00' },
      ]}
      now="2026-11-14T12:00:00"
      onSelect={(c) => notify(`已选择：${c.title}`)}
      onNew={() => notify('已创建新对话')}
    />
  ),
  'data-answer': () => (
    <DataAnswerUI.DataAnswer
      data={{
        title: '数据分析助手',
        model: '云帆推理模型',
        sources: [
          {
            id: '1',
            name: '运行数据库',
            status: 'synced',
            detail: '24,892 条记录',
          },
        ],
        saved: [{ id: '1', title: '本周通过率' }],
        messages: D.messages,
        user: { name: '陈明' },
      }}
      onSend={(t) => notify(`正在模拟分析：${t}`)}
    />
  ),
  'data-table': () => (
    <DataTableUI.DataTable
      title="最近运行"
      data={D.agents.map((a, i) => ({
        id: a.id,
        name: a.task,
        agent: a.name,
        status: {
          running: '运行中',
          done: '已完成',
          waiting: '等待中',
          paused: '已暂停',
          queued: '排队中',
          failed: '失败',
          cancelled: '已取消',
        }[a.status],
        duration: `${28 + i * 7} 秒`,
      }))}
      columns={[
        { key: 'name', label: '任务名称', sortable: true },
        { key: 'agent', label: '智能体' },
        { key: 'status', label: '状态', sortable: true },
        { key: 'duration', label: '耗时', align: 'right' },
      ]}
      searchable
      selectable
      onRowClick={(r) => notify(`运行详情：${r.name}`)}
    />
  ),
  'date-field': () => <DateDemo />,
  'delivery-heatmap': () => (
    <DeliveryHeatmapUI.DeliveryHeatmap
      title="事件投递"
      labels={Array.from({ length: 24 }, (_, i) => `${i}:00`)}
      endpoints={['智能体运行', '工具调用', '评测完成'].map((label, r) => ({
        id: label,
        label,
        buckets: Array.from({ length: 24 }, (_, i) => ({
          attempts: 10 + ((i * 7) % 40),
          failed: r === 1 && i > 16 && i < 20 ? 8 : 0,
        })),
      }))}
    />
  ),
  'deploy-timeline': () => (
    <DeployTimelineUI.DeployTimeline
      title="模型发布记录"
      now="2026-11-14T12:00:00Z"
      deploys={[
        {
          id: '1',
          version: 'v2.2',
          kind: 'model',
          at: '2026-11-08',
          score: 0.92,
        },
        {
          id: '2',
          version: 'v2.3',
          kind: 'prompt',
          at: '2026-11-10',
          score: 0.95,
        },
        {
          id: '3',
          version: 'v2.4',
          kind: 'model',
          at: '2026-11-13',
          score: 0.986,
        },
      ]}
      onRollback={() => notify('已回滚模拟版本')}
    />
  ),
  disclosure: () => (
    <DisclosureUI.Accordion
      defaultValue={['1']}
      items={[
        {
          id: '1',
          title: '这些数据来自哪里？',
          content: '当前工作台使用本地模拟数据，所有操作均可安全体验。',
        },
        {
          id: '2',
          title: '如何开始一次评测？',
          content: '进入模型评测，选择模型和数据集，然后运行模拟评测。',
        },
      ]}
    />
  ),
  'diverging-bars': () => (
    <DivergingBarsUI.DivergingBars
      title="正负反馈"
      labels={D.labels}
      series={[D.series[0]]}
      below={{
        id: 'negative',
        label: '负向反馈',
        values: [4, 8, 5, 7, 3, 6, 4],
        color: '#e79d9d',
      }}
    />
  ),
  'dot-histogram': () => (
    <DotHistogramUI.DotHistogram
      title="响应耗时分布"
      values={Array.from({ length: 200 }, (_, i) => 0.2 + ((i * 7) % 30) / 10)}
      threshold={2.5}
      unit="秒"
    />
  ),
  'drop-zone': () => (
    <DropZoneUI.DropZone
      title="拖入评测文件"
      hint="支持 CSV、JSON · 仅本地读取文件名"
      accept=".csv,.json"
      onFiles={(f) => notify(`已选择：${f.map((x) => x.name).join('、')}`)}
      onReject={(r) => ToastStackUI.toast.error(r[0].reason)}
    />
  ),
  'empty-state': () => (
    <EmptyStateUI.EmptyState
      title="还没有保存的报告"
      description="开始一次研究，把有价值的发现留在这里。"
      action={{
        label: '创建第一份报告',
        onClick: () => notify('已创建模拟报告'),
      }}
    />
  ),
  'eval-race': () => <RaceDemo />,
  'eval-results': () => <EvalResultsUI.EvalResults data={D.evalData} />,
  'file-changes': () => (
    <FileChangesUI.FileChanges
      data={D.files}
      onApply={() => notify('变更已应用（模拟）')}
      onDiscard={() => notify('变更已丢弃（模拟）')}
    />
  ),
  'form-card': () => (
    <FormCardUI.FormCard
      data={{
        title: '创建研究任务',
        description: '设置任务信息和执行偏好',
        fields: [
          {
            name: 'title',
            label: '任务名称',
            type: 'text',
            required: true,
            placeholder: '例如：本周竞品研究',
          },
          { name: 'desc', label: '研究目标', type: 'textarea' },
          { name: 'notify', label: '完成后通知我', type: 'switch' },
        ],
      }}
      onSubmit={() => notify('研究任务已创建')}
      submitLabel="创建任务"
    />
  ),
  'handoff-inbox': () => (
    <HandoffInboxUI.HandoffInbox
      data={{
        team: '支持团队',
        operator: { id: 'alex', name: '陈明' },
        bot: { name: '客服助手' },
        queue: [
          {
            id: 'q1',
            customer: { name: '林可' },
            snippet: '需要升级团队套餐',
            reason: '套餐咨询',
            waiting: 120,
          },
        ],
        activeId: 'q1',
        messages: [
          {
            id: '1',
            from: 'customer',
            at: '2026-11-14T10:24:00+08:00',
            content: '你好，我想升级团队套餐。',
          },
        ],
        summary: { wants: '升级团队套餐', tried: ['已查看当前订阅'] },
        customer: {
          name: '林可',
          plan: '专业版',
          since: '2025-08',
          orders: [],
          orderColumns: [],
          notes: D.memory,
        },
      }}
      onTakeOver={() => notify('已接管模拟会话')}
      onSend={(t) => notify(`模拟回复：${t}`)}
    />
  ),
  'hex-density': () => (
    <HexDensityUI.HexDensity
      title="词元与响应时间"
      points={points}
      x={{ label: '词元', max: 100 }}
      y={{ label: '响应时间', max: 100 }}
    />
  ),
  'inbox-cleanup': () => (
    <InboxCleanupUI.InboxCleanup
      title="收件箱整理"
      senders={[
        { id: '1', name: '产品周刊', perWeek: 5, openRate: 0.85 },
        { id: '2', name: '每日资讯', perWeek: 14, openRate: 0.08 },
        { id: '3', name: '设计文摘', perWeek: 3, openRate: 0.72 },
        { id: '4', name: '优惠促销', perWeek: 18, openRate: 0.03 },
      ]}
      onUnsubscribe={() => notify('已退订模拟邮件')}
    />
  ),
  'iso-bars': () => (
    <IsoBarsUI.IsoBars
      title="模型调用对比"
      labels={D.labels}
      back={D.series}
      front={[{ ...D.series[0], values: [20, 32, 28, 42, 38, 50, 46] }]}
    />
  ),
  'json-viewer': () => (
    <JsonViewerUI.JsonViewer
      title="运行配置"
      data={{
        智能体: '研究助手',
        模型: '云帆推理模型',
        工具: ['网页搜索', '文件读取'],
        设置: { 最大步骤: 12, 温度: 0.7 },
      }}
    />
  ),
  'key-hint': () => (
    <div className="flex items-center gap-3">
      <KeyHintUI.KeyCombo keys="mod+k" />
      <span>搜索工作台</span>
      <KeyHintUI.KeyCombo keys="shift+enter" />
      <span>换行</span>
    </div>
  ),
  'lap-timer': () => (
    <LapTimerUI.LapTimer
      title="评测计时"
      elapsed={42.8}
      best={39.2}
      lap="第 4 圈 / 共 5 圈"
      sectors={[
        { id: '1', label: '预处理', best: 8.2, split: 8.6 },
        { id: '2', label: '模型推理', best: 24.4, split: 25.2 },
        { id: '3', label: '评分', best: 6.6, split: 9 },
      ]}
    />
  ),
  loader: () => (
    <div className="flex items-center gap-8">
      <LoaderUI.Spinner showLabel label="加载中" />
      <LoaderUI.Thinking words={['正在思考', '整理思路', '准备回复']} />
    </div>
  ),
  'loading-skeleton': () => <LoadingSkeletonUI.CardSkeleton />,
  'match-field': () => (
    <MatchFieldUI.MatchField
      title="模型能力匹配"
      sectors={['推理', '代码', '写作', '知识']}
      items={['云帆模型', '星河通用模型', '轻舟模型', '知源模型'].map(
        (name, i) => ({
          id: name,
          name,
          sector: i,
          score: 0.82 + i * 0.04,
        }),
      )}
    />
  ),
  'mcp-servers': () => (
    <McpServersUI.McpServers
      data={[
        {
          id: 's1',
          name: '工作空间',
          transport: 'stdio',
          status: 'connected',
          tools: [
            { name: '读取文件', description: '读取项目文件', enabled: true },
            { name: '搜索内容', description: '搜索项目内容', enabled: true },
          ],
        },
        {
          id: 's2',
          name: '数据分析',
          transport: 'http',
          status: 'needs-auth',
          tools: [],
        },
      ]}
      onToggleTool={() => notify('工具状态已更新（模拟）')}
      onAuthorize={() => notify('模拟连接已授权')}
    />
  ),
  'memory-panel': () => (
    <MemoryPanelUI.MemoryPanel
      data={D.memory}
      title="项目记忆"
      onEdit={() => notify('记忆已更新（模拟）')}
      onForget={() => notify('记忆已移除（模拟）')}
    />
  ),
  'message-branches': () => (
    <MessageBranchesUI.MessageBranches
      data={{
        versions: [
          {
            id: '1',
            kind: 'original',
            content: '使用均衡模型，兼顾质量与成本。',
            label: '初始回复',
          },
          {
            id: '2',
            kind: 'regenerated',
            content: '根据任务难度自动分配模型，预计节省 23% 费用。',
            label: '优化回复',
          },
        ],
      }}
      variant="map"
    />
  ),
  'message-log': () => (
    <MessageLogUI.MessageLog
      title="事件日志"
      events={Array.from({ length: 5 }, (_, i) => ({
        id: `evt-${i}`,
        type: '智能体运行完成',
        endpoint: '/webhooks/workspace',
        at: `2026-11-14T10:${20 + i}:00Z`,
        attempts: [
          {
            status: 'delivered' as const,
            at: `2026-11-14T10:${20 + i}:00Z`,
            code: 200,
          },
        ],
        latencyMs: 120 + i * 28,
      }))}
      buckets={Array.from({ length: 12 }, (_, i) => ({
        at: `2026-11-14T10:${String(i * 5).padStart(2, '0')}:00Z`,
        delivered: 12 + i * 3,
        failed: i === 6 ? 3 : 0,
      }))}
    />
  ),
  'mirror-strips': () => (
    <MirrorStripsUI.MirrorStrips
      title="输入与输出词元"
      columns={D.labels}
      rows={[
        {
          id: 'sonnet',
          label: '云帆模型',
          up: [12, 18, 14, 22, 16, 28, 24],
          down: [8, 12, 10, 14, 9, 16, 14],
        },
        {
          id: 'flash',
          label: '轻舟模型',
          up: [8, 12, 10, 18, 12, 20, 16],
          down: [4, 8, 6, 12, 8, 14, 10],
        },
      ]}
      series={{ up: { label: '输入' }, down: { label: '输出' } }}
    />
  ),
  'modal-sheet': () => (
    <div className="flex gap-2">
      <ModalSheetUI.Dialog
        title="新建项目"
        trigger={<ActionButtonUI.Button>打开弹窗</ActionButtonUI.Button>}
      >
        <p>所有任务、评测与研究，都可以在项目中有序管理。</p>
      </ModalSheetUI.Dialog>
      <ModalSheetUI.Sheet
        title="项目详情"
        trigger={<ActionButtonUI.Button>打开侧滑面板</ActionButtonUI.Button>}
        side="right"
      >
        <p>工作空间 / 产品研究</p>
      </ModalSheetUI.Sheet>
    </div>
  ),
  'popover-panel': () => (
    <PopoverPanelUI.Popover
      title="项目成员"
      trigger={<ActionButtonUI.Button>查看成员</ActionButtonUI.Button>}
    >
      <div className="p-2">
        陈明 · 管理员
        <br />
        王莉 · 编辑者
      </div>
    </PopoverPanelUI.Popover>
  ),
  'progress-bar': () => (
    <div className="grid gap-4">
      <ProgressBarUI.ProgressBar value={72} label="任务进度" striped />
      <ProgressBarUI.SegmentedBar
        max={100}
        label="模型用量"
        segments={[
          { id: '1', label: '云帆模型', value: 48, color: '#3978ef' },
          { id: '2', label: '轻舟模型', value: 24, color: '#93b6f6' },
        ]}
      />
    </div>
  ),
  'prompt-suggestions': () => (
    <PromptSuggestionsUI.PromptSuggestions
      data={D.suggestions}
      onSelect={(_, p) => notify(`已选择：${p}`)}
    />
  ),
  'radar-chart': () => (
    <RadarChartUI.RadarChart
      title="模型能力画像"
      axes={['推理', '代码', '写作', '知识', '速度', '成本']}
      max={100}
      series={{
        id: 'sonnet',
        label: '云帆模型',
        values: [94, 96, 92, 88, 78, 72],
      }}
      baseline={{ label: '基准', values: [75, 80, 78, 82, 84, 90] }}
    />
  ),
  'radial-dots': () => (
    <RadialDotsUI.RadialDots
      title="每周活跃分布"
      labels={D.labels}
      series={D.series}
      center={{ value: '24.8k', caption: '总请求量' }}
    />
  ),
  'range-slider': () => (
    <RangeSliderUI.Slider
      label="模型温度"
      defaultValue={0.7}
      min={0}
      max={1}
      step={0.1}
      format={(v) => v.toFixed(1)}
    />
  ),
  'rate-limits': () => <RateLimitsUI.RateLimits data={D.limits} />,
  'renewal-rings': () => (
    <RenewalRingsUI.RenewalRings
      title="订阅续约"
      subtitle="管理团队的软件订阅"
      today="2026-11-14"
      contracts={D.contracts}
    />
  ),
  'response-feedback': () => (
    <ResponseFeedbackUI.ResponseFeedback
      variant="detailed"
      onSubmit={() => notify('感谢反馈，已保存评分')}
    />
  ),
  'result-carousel': () => (
    <ResultCarouselUI.ResultCarousel
      title="相关研究"
      compact
      data={[
        {
          id: '1',
          title: '智能工作台设计趋势',
          meta: '面向团队的智能工作流',
          action: '查看报告',
        },
        {
          id: '2',
          title: '模型评测实践',
          meta: '从数据集到持续评测',
          action: '查看报告',
        },
      ]}
      onAction={() => notify('已打开模拟报告')}
    />
  ),
  'rolling-number': () => <RollingDemo />,
  'run-trace': () => (
    <RunTraceUI.RunTrace data={{ spans: D.spans, elapsedMs: 4200 }} />
  ),
  'segmented-control': () => (
    <SegmentedControlUI.Segmented
      label="运行模式"
      options={[
        { value: 'fast', label: '快速' },
        { value: 'balanced', label: '均衡' },
        { value: 'quality', label: '高质量' },
      ]}
      defaultValue="balanced"
    />
  ),
  'select-field': () => (
    <SelectFieldUI.Select
      label="默认模型"
      defaultValue="sonnet"
      options={[
        { value: 'sonnet', label: '云帆推理模型' },
        { value: 'gpt', label: '星河通用模型' },
        { value: 'flash', label: '轻舟快速模型' },
      ]}
    />
  ),
  'slot-picker': () => (
    <SlotPickerUI.SlotPicker
      data={slotData}
      onConfirm={() => notify('已确认模拟预约')}
    />
  ),
  'source-list': () => (
    <SourceListUI.SourceList
      data={{
        text: '评测设计参考 TuffUI 的组件说明。[1]',
        sources: [
          {
            id: '1',
            title: 'TuffUI 组件文档',
            url: 'https://tuffui.com/components/eval-race',
            snippet: '以赛道可视化呈现多个模型的评测进度。',
          },
        ],
      }}
    />
  ),
  'stat-grid': () => <StatGridUI.StatGrid data={D.stats} />,
  'status-pill': () => (
    <div className="flex flex-wrap gap-2">
      <StatusPillUI.StatusPill tone="positive">
        运行正常
      </StatusPillUI.StatusPill>
      <StatusPillUI.StatusPill tone="brand">评测中</StatusPillUI.StatusPill>
      <StatusPillUI.StatusPill tone="warning">等待审批</StatusPillUI.StatusPill>
      <StatusPillUI.Tag>v2.4.0</StatusPillUI.Tag>
    </div>
  ),
  'streaming-message': () => (
    <StreamingMessageUI.StreamingMessage
      data={{
        content:
          '所有评测已完成。**云帆推理模型** 在复杂推理和代码生成中表现出色，轻舟快速模型 更适合低延迟任务。',
        status: 'done',
        reasoning: {
          text: '比较了四个模型的准确率、耗时和成本。',
          durationMs: 1200,
        },
      }}
      model="云帆推理模型"
    />
  ),
  'support-widget': () => (
    <SupportWidgetUI.SupportWidget
      data={{
        bot: { name: '工作台助手', role: '工作台使用帮助' },
        visitor: { name: '陈明' },
        messages: [
          {
            id: '1',
            role: 'assistant',
            at: '2026-11-14T10:25:00+08:00',
            content:
              '你好，欢迎来到工作台。点击左侧导航，开始探索组件和模拟功能。',
          },
        ],
      }}
      onSend={(t) => notify(`已收到咨询：${t}`)}
    >
      <div className="p-8 text-center text-muted-foreground">
        点击右下角对话按钮，打开帮助面板。
      </div>
    </SupportWidgetUI.SupportWidget>
  ),
  surface: () => (
    <SurfaceUI.Shell>
      <SurfaceUI.ShellHeader
        title="层次化容器"
        subtitle="外层容器 / 内容面板 / 内嵌区域"
      />
      <SurfaceUI.Panel className="p-4">
        <p className="mb-3 text-sm">内容面板</p>
        <SurfaceUI.Inset className="p-3 text-sm text-muted-foreground">
          嵌入式内容区域
        </SurfaceUI.Inset>
      </SurfaceUI.Panel>
    </SurfaceUI.Shell>
  ),
  'tab-panels': () => (
    <TabPanelsUI.Tabs defaultValue="overview">
      <TabPanelsUI.TabList label="项目标签">
        <TabPanelsUI.Tab value="overview">概览</TabPanelsUI.Tab>
        <TabPanelsUI.Tab value="details">详情</TabPanelsUI.Tab>
      </TabPanelsUI.TabList>
      <TabPanelsUI.TabPanel value="overview">
        <p className="p-3 text-sm">项目概览：所有智能体 运行正常。</p>
      </TabPanelsUI.TabPanel>
      <TabPanelsUI.TabPanel value="details">
        <p className="p-3 text-sm">
          当前项目包含 4 个模型、3 个智能体 和 1,000 条评测用例。
        </p>
      </TabPanelsUI.TabPanel>
    </TabPanelsUI.Tabs>
  ),
  'terminal-output': () => (
    <TerminalOutputUI.TerminalOutput data={D.terminal} />
  ),
  'text-field': () => (
    <div className="grid gap-3">
      <TextFieldUI.TextField label="项目名称" defaultValue="产品研究工作台" />
      <TextFieldUI.TextArea label="项目描述" placeholder="描述你的项目…" />
    </div>
  ),
  'tick-gauge': () => (
    <TickGaugeUI.TickGauge
      title="服务可用性"
      value={0.986}
      target={0.99}
      targetLabel="目标 99%"
      caption="过去 7 天 · 24,892 次请求"
    />
  ),
  'toast-stack': () => (
    <div className="flex gap-2">
      <ActionButtonUI.Button onClick={() => notify('项目已保存')}>
        成功通知
      </ActionButtonUI.Button>
      <ActionButtonUI.Button
        onClick={() => ToastStackUI.toast.error('这是一条模拟错误通知')}
      >
        错误通知
      </ActionButtonUI.Button>
    </div>
  ),
  'tone-rewrite': () => <RewriteDemo />,
  'tool-approval-queue': () => (
    <ToolApprovalQueueUI.ToolApprovalQueue
      data={D.approvals}
      onDecide={(_, d) =>
        notify(d === 'approved' ? '模拟请求已批准' : '模拟请求已拒绝')
      }
    />
  ),
  'tool-call-block': () => (
    <ToolCallBlockUI.ToolCallBlock data={tool} defaultOpen />
  ),
  'tool-call-graph': () => (
    <ToolCallGraphUI.ToolCallGraph
      title="工具调用拓扑"
      agent={{ label: '研究助手', meta: '1,200 次运行' }}
      tools={[
        {
          id: '搜索内容',
          label: '网页搜索',
          calls: 842,
          p50Ms: 820,
          errorRate: 0.02,
        },
        {
          id: 'read',
          label: '文件读取',
          calls: 1240,
          p50Ms: 42,
          errorRate: 0.003,
        },
        {
          id: 'write',
          label: '文件写入',
          calls: 320,
          p50Ms: 68,
          errorRate: 0.008,
        },
      ]}
    />
  ),
  'tooltip-hint': () => (
    <TooltipHintUI.Tooltip content="所有操作仅影响本地模拟数据">
      <ActionButtonUI.Button>悬停查看提示</ActionButtonUI.Button>
    </TooltipHintUI.Tooltip>
  ),
  'usage-summary': () => (
    <UsageSummaryUI.UsageSummary
      currency="CNY"
      title="模型使用情况"
      data={D.usage}
    />
  ),
  'user-message': () => (
    <UserMessageUI.UserMessage
      data={{
        id: '1',
        content: '帮我整理一下这周的产品研究结果，重点关注模型评测。',
        sentAt: '10:24',
        status: 'sent',
      }}
      onEdit={() => notify('消息已更新（模拟）')}
    />
  ),
}
function ConfirmationDemo() {
  const [done, setDone] = useState(false)
  return (
    <ConfirmationCardUI.ConfirmationCard
      currency="CNY"
      data={{
        title: '确认团队订阅',
        items: [
          {
            id: '1',
            label: '工作台团队版',
            detail: '5 位成员 · 月付',
            amount: 29,
            quantity: 5,
          },
        ],
        reference: 'DEMO-2026',
      }}
      status={done ? 'done' : 'review'}
      onConfirm={() => setDone(true)}
      onUndo={() => setDone(false)}
    />
  )
}
function DateDemo() {
  const [date, setDate] = useState<Date | null>(new Date('2026-11-14T12:00:00'))
  return (
    <DateFieldUI.Calendar value={date} onValueChange={setDate} locale="zh-CN" />
  )
}
function RollingDemo() {
  const [value, setValue] = useState(24892)
  return (
    <div className="flex items-center gap-5">
      <RollingNumberUI.RollingNumber
        value={value}
        className="text-4xl font-semibold"
      />
      <ActionButtonUI.Button onClick={() => setValue((v) => v + 128)}>
        增加运行
      </ActionButtonUI.Button>
    </div>
  )
}
export function Demo({ name }: { name: string }) {
  return <>{demoMap[name]?.()}</>
}
