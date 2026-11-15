import type { BackgroundAgent } from '@/components/ui/background-agents'
import type { ThreadMessage } from '@/components/ui/chat-thread'
import type { EvalResultsProps } from '@/components/ui/eval-results'
import type { FileChange } from '@/components/ui/file-changes'
import type { TerminalRun } from '@/components/ui/terminal-output'
import type { ToolApprovalRequest } from '@/components/ui/tool-approval-queue'
export const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export const series = [
  {
    id: 'requests',
    label: '成功请求',
    values: [28, 42, 38, 64, 51, 85, 76],
    color: '#3978ef',
  },
  {
    id: 'cached',
    label: '缓存命中',
    values: [12, 18, 16, 28, 22, 35, 32],
    color: '#a9c5fa',
  },
]
export const racers = [
  {
    id: 'claude',
    label: '云帆推理模型',
    scored: 842,
    laps: [12.8, 12.4, 12.1, 11.8],
  },
  { id: 'gpt', label: '星河通用模型', scored: 756, laps: [13.2, 12.9, 12.6] },
  {
    id: 'gemini',
    label: '轻舟快速模型',
    scored: 692,
    laps: [14.1, 13.8, 13.2],
  },
  { id: 'deepseek', label: '知源开源模型', scored: 581, laps: [15.1, 14.6] },
]
export const stats = [
  {
    id: 'runs',
    label: '总运行次数',
    value: '24,892',
    delta: 12.8,
    trend: [12, 18, 14, 22, 19, 28, 32],
  },
  {
    id: 'pass',
    label: '评测通过率',
    value: '98.6%',
    delta: 2.4,
    trend: [80, 84, 82, 90, 89, 95, 98],
  },
  {
    id: 'latency',
    label: '平均响应时间',
    value: '1.24 秒',
    delta: -18.2,
    higherIsBetter: false,
    trend: [30, 26, 28, 22, 24, 18, 15],
  },
  {
    id: 'cost',
    label: '本月使用费用',
    value: '¥128.42',
    delta: -6.3,
    higherIsBetter: false,
    trend: [20, 25, 18, 23, 15, 18, 16],
  },
]
export const agents: BackgroundAgent[] = [
  {
    id: 'research',
    name: '研究助手',
    task: '整理产品研究资料',
    status: 'running',
    progress: 0.72,
    action: '阅读第 8 份资料',
    elapsedMs: 42000,
  },
  {
    id: 'code',
    name: '开发助手',
    task: '检查工作台组件',
    status: 'done',
    progress: 1,
    elapsedMs: 28000,
  },
  {
    id: 'writer',
    name: '写作助手',
    task: '生成本周产品周报',
    status: 'waiting',
    progress: 0.48,
    action: '等待工具授权',
    elapsedMs: 16000,
  },
]
export const approvals: ToolApprovalRequest[] = [
  {
    id: 'a1',
    tool: '文件写入',
    title: '保存本周产品研究报告',
    risk: 'low',
    agent: '研究助手',
    payload: {
      kind: 'diff',
      path: '报告/本周研究报告.md',
      lines: [
        { type: 'add', text: '# 本周产品研究' },
        { type: 'add', text: '完成 12 个竞品的功能与体验分析。' },
      ],
    },
  },
  {
    id: 'a2',
    tool: '运行终端',
    title: '运行工作台构建检查',
    risk: 'medium',
    agent: '开发助手',
    payload: {
      kind: 'shell',
      command: 'npm run build',
      cwd: '/workspace/studio',
    },
  },
  {
    id: 'a3',
    tool: '邮件发送',
    title: '向团队发送本周项目摘要',
    risk: 'high',
    agent: '写作助手',
    payload: {
      kind: 'email',
      to: 'team@example.com',
      subject: '本周项目摘要',
      body: '团队好，本周完成了评测流程和组件工作台的升级。',
    },
  },
]
export const messages: ThreadMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: '帮我分析一下最近一周的模型表现，给出优化建议。',
    at: '2026-11-14T10:24:00+08:00',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      '已整理最近 7 天的运行数据。整体通过率达到 98.6%，平均响应时间下降了 18.2%。建议将简单分类任务路由到 轻舟模型 模型，复杂推理继续使用 云帆模型，预计可以节约约 23% 的成本。',
    at: '2026-11-14T10:24:00+08:00',
  },
]
export const suggestions = [
  { id: 's1', title: '分析模型表现', hint: '比较通过率与响应时间' },
  { id: 's2', title: '生成产品周报', hint: '将研究结果整理成摘要' },
  { id: 's3', title: '检查运行日志', hint: '定位失败的工具调用' },
]
export const context = {
  limit: 128000,
  model: '云帆推理模型',
  segments: [
    { id: 'sys', label: '系统指令', tokens: 4200 },
    { id: 'files', label: '项目文件', tokens: 18400 },
    { id: 'chat', label: '对话记录', tokens: 8600 },
  ],
}
export const evalData: EvalResultsProps['data'] = {
  suite: '客服对话质量评测',
  label: '第 2.4 版 · 1,000 条用例',
  baselinePassRate: 0.94,
  cases: Array.from({ length: 24 }, (_, i) => ({
    id: `case-${i}`,
    name:
      ['意图识别', '知识准确性', '多轮理解', '格式遵循'][i % 4] + ` #${i + 1}`,
    status:
      i === 7
        ? 'fail'
        : i === 15
          ? 'regressed'
          : i % 5 === 0
            ? 'improved'
            : 'pass',
    score: i === 7 ? 0.62 : 0.91 + (i % 8) / 100,
    input: '这款产品支持退换吗？',
    expected: '说明退换货期限和条件。',
    actual: '支持七天无理由退货，请保持商品完好。',
  })),
  metrics: [
    {
      id: 'acc',
      label: '准确率',
      baseline: 0.94,
      candidate: 0.986,
      better: 'higher',
    },
  ],
}
export const usage = {
  models: [
    { id: 'sonnet', name: '云帆模型', color: '#3978ef' },
    { id: 'flash', name: '轻舟模型', color: '#9ab9f3' },
  ],
  days: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-11-${String(i + 1).padStart(2, '0')}`,
    byModel: {
      sonnet: { tokens: 10000 + i * 2000, cost: 4 + (i % 5) },
      flash: { tokens: 8000 + i * 1500, cost: 1 + (i % 3) },
    },
  })),
  previousCost: 145,
  budget: { limit: 250, label: '月度预算' },
}
export const limits = {
  model: '云帆推理模型 · 团队版',
  limits: [
    {
      id: 'rpm',
      label: '每分钟请求数',
      limit: 1000,
      remaining: 764,
      resetsInMs: 45000,
    },
    {
      id: 'tpm',
      label: '每分钟词元数',
      limit: 100000,
      remaining: 62000,
      resetsInMs: 45000,
    },
  ],
}
export const spans = [
  {
    id: 'root',
    name: '产品研究',
    startMs: 0,
    endMs: 4200,
    kind: 'agent' as const,
    status: 'ok' as const,
  },
  {
    id: 'llm',
    parentId: 'root',
    name: '模型生成',
    startMs: 100,
    endMs: 2900,
    kind: 'llm' as const,
    status: 'ok' as const,
  },
  {
    id: 'tool',
    parentId: 'root',
    name: '网页搜索',
    startMs: 2900,
    endMs: 4000,
    kind: 'tool' as const,
    status: 'ok' as const,
  },
]
export const files: FileChange[] = [
  {
    id: 'f1',
    path: 'src/workbench.tsx',
    status: 'modified',
    hunks: [
      {
        id: 'h1',
        oldStart: 12,
        newStart: 12,
        lines: [
          { type: 'context', text: 'export function Workbench() {' },
          { type: 'remove', text: '  return <div>欢迎</div>' },
          { type: 'add', text: '  return <Dashboard compact />' },
          { type: 'context', text: '}' },
        ],
      },
    ],
  },
]
export const terminal: TerminalRun = {
  command: 'npm run build',
  cwd: '~/workspace/studio',
  status: 'success',
  exitCode: 0,
  durationMs: 1280,
  lines: [
    { text: '正在构建生产版本…' },
    { text: '✓ 已处理 248 个模块。' },
    { text: '✓ 构建完成，用时 1.28 秒。' },
  ],
}
export const checkpoints = [
  {
    id: 'cp1',
    label: '创建工作台',
    at: '10:12',
    files: [{ path: 'src/workbench.tsx', additions: 42, deletions: 0 }],
  },
  {
    id: 'cp2',
    label: '添加评测组件',
    at: '10:24',
    files: [{ path: 'src/workbench.tsx', additions: 18, deletions: 3 }],
  },
]
export const contracts = [
  {
    id: 'notion',
    name: '协作文档团队版',
    endDate: '2026-12-12',
    noticeDays: 14,
    value: 2400,
    autoRenew: true,
  },
  {
    id: 'vercel',
    name: '云端部署专业版',
    endDate: '2027-02-18',
    noticeDays: 30,
    value: 1200,
    autoRenew: true,
  },
  {
    id: 'linear',
    name: '项目管理企业版',
    endDate: '2027-04-08',
    noticeDays: 30,
    value: 1800,
    autoRenew: false,
  },
]
export const memory = [
  {
    id: 'mem1',
    text: '界面采用紧凑布局，减少不必要的留白。',
    scope: 'project' as const,
    pinned: true,
    source: '项目偏好',
  },
  {
    id: 'mem2',
    text: '用中文整理研究报告和项目摘要。',
    scope: 'user' as const,
    source: '对话记录',
  },
]
