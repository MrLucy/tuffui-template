import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

test('全部 TuffUI 组件预览均可渲染且分类完整', async () => {
  const server = await createServer({ server: { middlewareMode: true } })
  try {
    const { Demo, componentNames } = await server.ssrLoadModule(
      '/src/features/studio/demos.tsx',
    )
    const { componentLabels } = await server.ssrLoadModule(
      '/src/features/studio/component-labels.ts',
    )
    assert.deepEqual(
      Object.keys(componentLabels).sort(),
      [...componentNames].sort(),
    )
    assert.ok(
      Object.values(componentLabels).every((label) =>
        /[\u4e00-\u9fff]/.test(label),
      ),
    )
    const { categories } = await server.ssrLoadModule(
      '/src/features/studio/navigation.ts',
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
      '/src/features/studio/avara-demos.tsx',
    )
    const { avaraNames, avaraGroups } = await server.ssrLoadModule(
      '/src/features/studio/avara-catalog.ts',
    )
    const { allComponentNames, allComponentLabels, matchesComponent } =
      await server.ssrLoadModule('/src/features/studio/component-registry.ts')
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
