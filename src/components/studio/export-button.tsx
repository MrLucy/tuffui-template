import { ArrowDownToLine } from 'lucide-react'

import { Button } from '@/components/ui/action-button'
import * as D from '@/data/studio'
import { notify } from '@/lib/notify'

export function ExportButton() {
  return (
    <Button
      onClick={() => {
        const blob = new Blob(
          [
            JSON.stringify(
              {
                title: '工作台报告',
                date: '2026-11-14',
                stats: D.stats,
                agents: D.agents,
              },
              null,
              2,
            ),
          ],
          { type: 'application/json' },
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '工作台报告-2026-11-14.json'
        a.click()
        URL.revokeObjectURL(url)
        notify('报告已导出')
      }}
    >
      <ArrowDownToLine size={14} />
      导出报告
    </Button>
  )
}
