import type { FC } from 'react'

import { CardOne } from '@/pages/workbench/components/card-one'

const WorkbenchPage: FC = () => {
  return (
    <div className="grid min-h-full auto-rows-[minmax(140px,1fr)] grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
      <div className="rounded-xl border bg-muted/40 sm:col-span-2 sm:row-span-2">
        <CardOne
          contracts={[
            {
              id: 'contract-1',
              name: '示例客户 A',
              endDate: '2026-12-18',
              noticeDays: 30,
              value: 12000,
              autoRenew: true,
              note: '到期前 30 天确认是否续约',
            },
            {
              id: 'contract-2',
              name: '示例客户 B',
              endDate: '2027-03-01',
              noticeDays: 30,
              value: 24000,
              autoRenew: false,
            },
            {
              id: 'contract-3',
              name: '示例客户 C',
              endDate: '2027-06-15',
              noticeDays: 60,
              value: 36000,
              autoRenew: true,
            },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-muted/40"></div>
      <div className="rounded-xl border bg-muted/40" />
      <div className="rounded-xl border bg-muted/40 sm:col-span-2" />
      <div className="rounded-xl border bg-muted/40" />
      <div className="rounded-xl border bg-muted/40 sm:col-span-2" />
      <div className="rounded-xl border bg-muted/40" />
    </div>
  )
}
export default WorkbenchPage
