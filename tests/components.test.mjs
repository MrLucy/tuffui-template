import assert from 'node:assert/strict'
import { test } from 'node:test'

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

test('全部 TuffUI 组件预览均可渲染且分类完整', async () => {
  const server = await createServer({ server: { middlewareMode: true } })
  try {
    const { Demo } = await server.ssrLoadModule(
      '/src/components/studio/demos.tsx',
    )
    const { componentLabels, componentNames } = await server.ssrLoadModule(
      '/src/config/component-labels.ts',
    )
    assert.ok(
      Object.values(componentLabels).every((label) =>
        /[\u4e00-\u9fff]/.test(label),
      ),
    )
    const { categories } = await server.ssrLoadModule(
      '/src/config/component-categories.ts',
    )
    assert.equal(componentNames.length, 86)
    assert.equal(new Set(componentNames).size, 86)
    const categorized = Object.values(categories).flat()
    assert.deepEqual([...categorized].sort(), [...componentNames].sort())
    for (const name of componentNames) {
      const markup = renderToString(createElement(Demo, { name }))
      assert.ok(markup.length > 0, `${name} 预览为空`)
      assert.ok(!markup.includes('Invalid Date'), `${name} 的模拟日期无效`)
      assert.ok(
        !/<table(?![^>]*class="sr-only")/.test(markup),
        `${name} 不应显示表格布局`,
      )
      assert.ok(
        !markup.includes('role="table"'),
        `${name} 不应使用表格形式的内容区`,
      )
      assert.ok(
        !/Cases scored|Permission requests|High risk|Fastest lap|What should we work on/.test(
          markup,
        ),
        `${name} 存在未翻译标签`,
      )
    }
  } finally {
    await server.close()
  }
})

test('AvaraUI 的 28 个官方组件与统一组件目录均可用', async () => {
  const server = await createServer({ server: { middlewareMode: true } })
  try {
    const { AvaraDemo } = await server.ssrLoadModule(
      '/src/components/studio/avara-demos.tsx',
    )
    const { avaraNames, avaraGroups } = await server.ssrLoadModule(
      '/src/config/avara-catalog.ts',
    )
    const { allComponentNames, allComponentLabels, matchesComponent } =
      await server.ssrLoadModule('/src/config/component-registry.ts')
    assert.equal(avaraNames.length, 28)
    assert.equal(allComponentNames.length, 114)
    assert.equal(new Set(allComponentNames).size, 114)
    assert.deepEqual(
      Object.values(avaraGroups).flat().sort(),
      [...avaraNames].sort(),
    )
    assert.ok(matchesComponent('avara/folder', '资源'))
    assert.ok(matchesComponent('avara/card-stack', '研究'))
    for (const name of avaraNames) {
      assert.match(allComponentLabels[name], /[\u4e00-\u9fff]/)
      const markup = renderToString(createElement(AvaraDemo, { name }))
      assert.ok(markup.length > 0, `${name} 预览为空`)
      assert.ok(!markup.includes('Invalid Date'), `${name} 日期无效`)
      assert.ok(!/<table/.test(markup), `${name} 不应显示表格`)
      assert.ok(
        !/Previous card|Drag to reorder|Opacity Channel|Preset Palette|Click to open/.test(
          markup,
        ),
        `${name} 存在英文界面文案`,
      )
    }
  } finally {
    await server.close()
  }
})

test('票券使用传入的航班字段与指标，结构化数据可覆盖顶层值', async () => {
  const server = await createServer({ server: { middlewareMode: true } })
  try {
    const { SecureEnvelope } = await server.ssrLoadModule(
      '/src/components/avara/blocks/SecureEnvelopeBlock.tsx',
    )
    const flight = {
      cardDesign: 'boarding-pass',
      flightNumber: 'MU-5101',
      gate: 'C18',
      boardingTime: '08:35',
      cabinClass: '商务舱',
      origin: 'SHA',
      destination: 'PEK',
      eticketNumber: '票号-12345',
      airlineCompany: '东方航空',
    }
    const markup = renderToString(createElement(SecureEnvelope, flight))
    for (const value of [
      'MU-5101',
      'C18',
      '08:35',
      '商务舱',
      'SHA ➔ PEK',
      '东方航空',
    ]) {
      assert.ok(markup.includes(value), `${value} 未显示`)
    }
    const override = renderToString(
      createElement(SecureEnvelope, {
        ...flight,
        data: { flightNumber: 'CA-1001', flightRoute: 'CAN ➔ SZX' },
      }),
    )
    assert.ok(override.includes('CA-1001'))
    assert.ok(override.includes('CAN ➔ SZX'))
    assert.ok(!override.includes('MU-5101'))
    const coupon = renderToString(
      createElement(SecureEnvelope, {
        metrics: [
          { label: '研究完成', value: '88%' },
          { label: '参与人数', value: '12 人' },
          { label: '审核状态', value: '已通过' },
        ],
      }),
    )
    for (const value of [
      '研究完成',
      '88%',
      '参与人数',
      '12 人',
      '审核状态',
      '已通过',
    ]) {
      assert.ok(coupon.includes(value), `${value} 未显示`)
    }
  } finally {
    await server.close()
  }
})
