# Tuff Studio

整合 TuffUI 的 86 个组件与 AvaraUI 的 28 个官方组件，构建共 114 个本地预览的紧凑型静态 AI 工作台。采用 Vite、React、TypeScript、Tailwind CSS v4 与 React Router。

支持工作台总览、Agent 中心、智能对话、模型评测、内容工作室、工具审批、数据洞察、项目与订阅、组件实验室和工作空间设置与创意交互 11 个路由。全部使用本地模拟数据，无需登录。组件实验室支持关键词搜索、分类筛选和展开全部预览；支持 `⌘/Ctrl + K` 全局搜索，以及导出 JSON 报告。

核心实现位于 `src/features/studio/`，组件位于 `src/components/ui/`。TuffUI 组件遵循 MIT License，原始版权信息保留在文件头。

## 开始开发

推荐 Node.js 24（见 `.nvmrc`）与 npm 11。

```sh
npm install
npm run dev
```

提交依赖锁文件后，在 CI 中使用 `npm ci` 安装。

## 常用命令

| 命令                   | 用途                                       |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | 启动开发服务器                             |
| `npm run build`        | 类型检查并构建到 `dist`                    |
| `npm run preview`      | 预览生产构建                               |
| `npm run typecheck`    | TypeScript 类型检查                        |
| `npm run lint`         | ESLint 和 Stylelint 检查                   |
| `npm run lint:fix`     | 自动修复代码、import/export 排序和样式问题 |
| `npm run format`       | Prettier 格式化及 Tailwind 类名排序        |
| `npm run format:check` | 仅检查格式                                 |
| `npm run check`        | 类型、代码、样式和格式检查                 |
| `npm run test:api`     | Axios、API 与 Mock 调用链路测试            |

## 项目结构

`mock/` 存放开发环境的 `*.mock.ts` 接口定义。

```text
src/
  api/                # 接口调用、业务类型和统一响应类型
  components/ui/       # shadcn/ui 组件
  layouts/            # 公共页面布局
  lib/utils.ts        # cn 工具函数
  lib/request.ts      # Axios 实例、响应校验、业务错误与数据解包
  pages/              # 首页、关于页和 404 页
  router/index.tsx    # React Router 路由配置
  App.tsx             # RouterProvider
  index.css           # Tailwind v4 入口与 shadcn 主题
  main.tsx            # React 入口
```

`@/` 指向 `src/`，同时配置于 Vite 与 TypeScript。项目采用 React Router 的 Browser History 路由，部署时请将非静态资源请求回退到 `index.html`，以支持直接访问 `/about` 等路径。

所有路由统一在 `src/router/index.tsx` 中以 `RouteObject[]` 配置，包含路径、页面组件、子路由、守卫和表单 Action 绑定。新增页面时在该文件的 `routes` 数组中配置；该文件统一创建并导出 `router` 实例，`App.tsx` 直接导入使用。

新增 shadcn/ui 组件：

```sh
npx shadcn@latest add @shadcn/input
```

Tailwind v4 使用 `@tailwindcss/vite`，主题在 `src/index.css` 中配置，无需 `tailwind.config.js`。TypeScript 采用 6.0，以匹配 typescript-eslint 的兼容范围。

## 登录与路由守卫

`/login` 为公开的中文登录页面，表单默认填写演示邮箱 `admin@example.com` 和密码 `123456`。首页、关于页及其他页面由 `src/router/guards.ts` 统一守卫：本地没有 Token 时跳转 `/login?redirect=原地址`，并替换当前历史记录。受保护页面之间切换时也会重新检查。

表单通过 React Router Action 调用 `src/api/auth.ts` 的 `login()`，请求 `POST /api/auth/login`。Mock 校验演示凭据并返回 `{ token, user }`；登录成功后调用 `setAccessToken(token)` 保存 Token，统一跳转到首页 `/`（HomePage），替换登录历史记录。错误凭据停留登录页并显示中文错误，空字段和邮箱格式在提交时校验，提交期间禁用表单防止重复请求。

退出时调用 `clearAccessToken()`。函数位于 `src/lib/auth.ts`，Token 存储在 `localStorage` 的 `tuffui.access-token` 中，刷新后保留。登录 Mock 仅用于开发，不提供真实身份验证。

Axios 自动携带 `Authorization: Bearer <token>`。HTTP 401 或业务响应 `code: 401` 会清除对应 Token，应用重新执行守卫并跳转登录页；同一页面调用上述工具函数及其他标签页清除 Token 时也会重新检查。当前守卫只判断 Token 是否存在，实际有效性由后端校验。

未来添加需要鉴权的子路由 `loader` 或 `action` 时，需在其中单独调用守卫；父子路由的 loader 会并行运行。参考 [React Router 路由文档](https://reactrouter.com/start/data/route-object)。

## Axios 封装

使用 [Axios](https://axios-http.com/docs/instance) 创建独立请求实例，封装于 `src/lib/request.ts`。页面从 `src/api/` 导入接口函数：

```ts
import { getHealth, getUser, getUsers } from '@/api'

const health = await getHealth()
const users = await getUsers({ keyword: '张' })
const user = await getUser(1)
```

- 默认 `baseURL` 为 `/api`，超时为 10 秒。可在 `.env.local` 中设置 `VITE_API_BASE_URL`，参考 `.env.example`。修改后重启开发服务器；生产环境变量需要在构建前配置。
- 约定响应为 `{ code: number, message: string, data: T }`，`code === 0` 表示成功，接口函数返回 `Promise<T>`，已解包 `data`。
- 业务错误抛出 `ApiError`，包含 `code`、`message` 和 HTTP `status`；响应格式错误使用 `code: -1`。HTTP、网络、超时错误保留 Axios 错误，可用 `axios.isAxiosError()` 判断。
- 接口函数支持请求配置，例如 `getUsers({}, { signal: controller.signal, timeout: 5000 })`；取消错误可用 `axios.isCancel()` 判断。调用方处理错误与界面提示。
- API 与 Mock 共用 `src/api/types.ts` 的类型。新增接口时在 `src/api/` 中调用 `request<T>({ url, method, params, data })`，再在 `mock/` 中添加相同路径和方法的模拟接口。

```ts
import axios from 'axios'

import { getUser } from '@/api'
import { ApiError } from '@/lib/request'

try {
  const user = await getUser(1)
  console.log(user.name)
} catch (error) {
  if (axios.isCancel(error)) return
  if (error instanceof ApiError) console.error(error.code, error.message)
  else if (axios.isAxiosError(error))
    console.error(error.response?.status, error.message)
}
```

## Mock 接口

已集成 [vite-plugin-mock-dev-server](https://github.com/pengzhanbo/vite-plugin-mock-dev-server)，在开发服务器中提供 `/api` 接口，修改 Mock 文件会自动重新加载规则。Mock 文件纳入 TypeScript 和 ESLint 检查。

`.env.development` 默认设置 `MOCK_ENABLED=true`。运行 `npm run dev` 后可验证：

```sh
curl http://localhost:5180/api/health
curl http://localhost:5180/api/users
curl http://localhost:5180/api/users/1
```

示例接口包括健康检查、用户列表（支持 `keyword` 查询参数）和用户详情；查询不存在的用户返回 HTTP 404。Mock 使用固定数据，列表与详情保持一致。默认 API 前缀与 Mock 均为 `/api`；若将 `VITE_API_BASE_URL` 改为远程地址，请求会直接发往远程后端。

新增接口时，在 `mock/` 下创建 `*.mock.ts`：

```ts
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  url: '/api/example',
  method: 'GET',
  body: { code: 0, message: 'ok', data: [] },
})
```

连接真实后端时，在 `.env.development.local` 中设置 `MOCK_ENABLED=false`，并在 `vite.config.ts` 的 `server.proxy` 中配置真实 API 地址，然后重启开发服务器。未匹配的 Mock 请求会继续交给 Vite（配置代理后可转发给后端）。

Mock 仅在开发服务器中启用，`npm run build` 和 `npm run preview` 均不会启用 Mock，也不会将 Mock 数据打包进前端产物。`MOCK_ENABLED` 是服务端配置，不会暴露给客户端。

## 代码规范

- ESLint 使用 flat config，包含 TypeScript、React Hooks、React Refresh 规则。
- `eslint-plugin-simple-import-sort` 排序 import/export，默认分为副作用、Node 内置、第三方包、别名和相对路径；副作用导入保持原有顺序。
- Prettier 统一格式，使用单引号、无分号；`prettier-plugin-tailwindcss` 排序类名，并支持 `cn()` 与 `cva()`。
- `eslint-config-prettier` 关闭与格式化冲突的 ESLint 规则。
- Stylelint 使用标准规则和 Tailwind 兼容配置，支持 `@theme`、`@apply`、`@custom-variant` 等指令。

## VS Code

打开项目后，安装 `.vscode/extensions.json` 推荐的 ESLint、Prettier、Stylelint、Tailwind CSS IntelliSense 和 EditorConfig 扩展。

- 保存时执行 Prettier 格式化、ESLint 修复（包括 import 排序）和 Stylelint 修复。
- 使用项目内 TypeScript 版本；首次提示时选择工作区版本。
- CSS 文件使用 Tailwind CSS 语言模式，支持 v4 指令补全与诊断。
- 禁用 VS Code 自带的 organize imports 保存动作，避免与 ESLint 排序规则冲突。
- `F5` 选择 `Vite: Chrome`，自动启动固定在 `127.0.0.1:5180` 的开发服务器并调试。
- `Ctrl/Cmd + Shift + B` 执行构建；也可从任务菜单运行 `check`。

集成参考：[Tailwind CSS Vite 安装](https://tailwindcss.com/docs/installation/using-vite)、[shadcn/ui Vite 安装](https://ui.shadcn.com/docs/installation/vite)、[React Router](https://reactrouter.com/start/declarative/installation)。

## AvaraUI 整合

`/creative` 集中演示 28 个 AvaraUI 交互组件；任务卡、资源文件夹、预约、流程图等也已组合进原有业务页面。`/components` 支持按 TuffUI / AvaraUI 筛选，并可中文搜索全部 114 个本地组件。AvaraUI 源码独立存放在 `src/components/avara`，官方来源与本地适配说明见该目录的 `sources.json` 和 `README.md`。两套库保持独立命名，AvaraUI 演示按需加载，不替换已验证的工作台卡片排布逻辑。
