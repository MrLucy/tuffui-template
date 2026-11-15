export function AboutPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">关于项目</h1>
      <p className="leading-7 text-muted-foreground">
        React Router 管理页面导航，ESLint 检查代码并排序 import，Prettier
        统一格式，Stylelint 检查样式。VS Code 保存时会自动修复和格式化。
      </p>
    </section>
  )
}
