// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
'use client'
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  Copy,
  MagnifyingGlass,
  SquaresFour,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import { Button, IconButton } from '@/components/ui/action-button'
import { Checkbox } from '@/components/ui/choice-controls'
import { EmptyState } from '@/components/ui/empty-state'
import { RollingNumber } from '@/components/ui/rolling-number'
import { Panel, Shell, ShellHeader } from '@/components/ui/surface'
import { SearchField } from '@/components/ui/text-field'
import { cn } from '@/lib/utils'
export type DataRow = { id: string } & Record<string, string | number | null>

export type DataColumn<R extends DataRow = DataRow> = {
  key: keyof R & string
  label: string
  align?: 'left' | 'right'
  /** Display text for a cell. Sorting and CSV use the raw value. */
  format?: (value: R[keyof R], row: R) => React.ReactNode
  sortable?: boolean
  /** Narrow columns don't grow. */
  width?: string
  /**
   * Which columns survive a narrow table: 1 always shows, 2 hides below a
   * 28rem-wide table, 3 below 36rem. Defaults to 1 for the first two columns,
   * 2 for the next two and 3 after that.
   */
  priority?: 1 | 2 | 3
}

export type DataTableProps<R extends DataRow = DataRow> = {
  data: R[]
  columns: DataColumn<R>[]
  title: string
  subtitle?: string
  /** Rows per page. */
  pageSize?: number
  /** Show the filter field above the table. */
  searchable?: boolean
  selectable?: boolean
  selected?: string[]
  onSelectedChange?: (ids: string[]) => void
  /** Bulk actions shown when rows are selected. */
  actions?: (ids: string[]) => React.ReactNode
  onRowClick?: (row: R) => void
  className?: string
}

type Sort = { key: string; dir: 'asc' | 'desc' } | null
const compare = (a: unknown, b: unknown) =>
  typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a ?? '').localeCompare(String(b ?? ''), 'zh-CN', { numeric: true })
const csvCell = (value: unknown) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** The record API stays compatible; records are presented as individual cards. */
export function DataTable<R extends DataRow>({
  data,
  columns,
  title,
  subtitle,
  pageSize = 6,
  searchable = true,
  selectable = false,
  selected: selectedProp,
  onSelectedChange,
  actions,
  onRowClick,
  className,
}: DataTableProps<R>) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>(null)
  const [page, setPage] = useState(0)
  const [ownSelected, setOwnSelected] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const selected = selectedProp ?? ownSelected
  const setSelected = (ids: string[]) => {
    setOwnSelected(ids)
    onSelectedChange?.(ids)
  }
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? data.filter((row) =>
          columns.some((column) =>
            String(row[column.key] ?? '')
              .toLowerCase()
              .includes(q),
          ),
        )
      : data
    return sort
      ? [...filtered].sort(
          (a, b) =>
            (sort.dir === 'asc' ? 1 : -1) * compare(a[sort.key], b[sort.key]),
        )
      : filtered
  }, [data, columns, query, sort])
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages - 1)
  const visible = rows.slice(current * pageSize, (current + 1) * pageSize)
  const allSelected =
    visible.length > 0 && visible.every((row) => selected.includes(row.id))
  const toggleSort = (key: string) => {
    setSort(
      sort?.key === key
        ? sort.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
        : { key, dir: 'asc' },
    )
    setPage(0)
  }
  const toggleAll = () =>
    setSelected(
      allSelected
        ? selected.filter((id) => !visible.some((row) => row.id === id))
        : [...new Set([...selected, ...visible.map((row) => row.id)])],
    )
  const copyRecords = async () => {
    try {
      await navigator.clipboard.writeText(
        [
          columns.map((c) => csvCell(c.label)).join(','),
          ...rows.map((row) =>
            columns.map((c) => csvCell(row[c.key])).join(','),
          ),
        ].join('\n'),
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be denied; keep the local callback available.
    }
  }
  const valueOf = (row: R, column: DataColumn<R>) =>
    column.format
      ? column.format(row[column.key], row)
      : String(row[column.key] ?? '—')
  return (
    <Shell className={cn('record-board', className)}>
      <ShellHeader
        icon={SquaresFour}
        title={title}
        subtitle={
          subtitle ?? (
            <>
              <RollingNumber value={rows.length} /> 条记录
            </>
          )
        }
        aside={
          <IconButton
            icon={copied ? Check : Copy}
            label={copied ? '记录已复制' : '复制记录'}
            onClick={copyRecords}
          />
        }
      />
      <Panel className="p-2">
        {searchable && (
          <SearchField
            placeholder="筛选记录"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(0)
            }}
            onClear={() => setQuery('')}
          />
        )}
        {(selectable || columns.some((column) => column.sortable)) && (
          <div className="record-controls">
            {selectable && (
              <Checkbox
                label="全选本页"
                checked={
                  allSelected
                    ? true
                    : visible.some((row) => selected.includes(row.id))
                      ? 'mixed'
                      : false
                }
                onCheckedChange={toggleAll}
              />
            )}
            {columns
              .filter((column) => column.sortable)
              .map((column) => {
                const SortIcon =
                  sort?.key === column.key && sort.dir === 'asc'
                    ? CaretUp
                    : CaretDown
                return (
                  <button
                    key={column.key}
                    aria-label={`按${column.label}排序`}
                    aria-pressed={sort?.key === column.key}
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    <SortIcon size={11} />
                  </button>
                )
              })}
          </div>
        )}
        {selectable && selected.length > 0 && (
          <div className="record-selection">
            <span>已选 {selected.length} 项</span>
            <Button variant="quiet" onClick={() => setSelected([])}>
              清空
            </Button>
            {actions?.(selected)}
          </div>
        )}
        {rows.length ? (
          <div className="record-card-grid" aria-label={`${title}记录卡片`}>
            {visible.map((row) => {
              const first = columns[0]
              const checked = selected.includes(row.id)
              return (
                <article
                  key={row.id}
                  className={`record-card ${checked ? 'is-selected' : ''}`}
                >
                  <header>
                    {selectable && (
                      <Checkbox
                        aria-label={`选择${first ? String(row[first.key]) : row.id}`}
                        checked={checked}
                        onCheckedChange={(on) =>
                          setSelected(
                            on
                              ? [...selected, row.id]
                              : selected.filter((id) => id !== row.id),
                          )
                        }
                      />
                    )}
                    <div className="record-card-title">
                      {onRowClick ? (
                        <button onClick={() => onRowClick(row)}>
                          {first ? valueOf(row, first) : row.id}
                        </button>
                      ) : (
                        <strong>{first ? valueOf(row, first) : row.id}</strong>
                      )}
                      <small>{first?.label ?? '记录'}</small>
                    </div>
                  </header>
                  <dl>
                    {columns.slice(1).map((column) => (
                      <div key={column.key}>
                        <dt>{column.label}</dt>
                        <dd>{valueOf(row, column)}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            compact
            icon={MagnifyingGlass}
            title="没有匹配记录"
            description={
              query ? `没有匹配“${query}”的记录。` : '新的记录会显示在这里。'
            }
          />
        )}
      </Panel>
      <footer className="record-footer">
        <span>
          {rows.length ? current * pageSize + 1 : 0}—
          {Math.min((current + 1) * pageSize, rows.length)} / {rows.length} 条
        </span>
        <div>
          <IconButton
            icon={CaretLeft}
            label="上一页"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          />
          <span>
            {current + 1} / {pages}
          </span>
          <IconButton
            icon={CaretRight}
            label="下一页"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          />
        </div>
      </footer>
    </Shell>
  )
}
