# CHANGES-77API

本仓库是 new-api（https://github.com/QuantumNous/new-api）的修改版本，用于 77API 平台；协议 AGPL-3.0（见 [LICENSE](LICENSE)、[NOTICE](NOTICE)）。按 AGPLv3 §7(c) 在此列出全部改动。

上游基线：`v1.0.0-rc.46`（提交 `7d8b912`）。我们的版本号带 `-77api.<n>` 后缀，例如 `v1.0.0-rc.46-77api.1`。

| 文件 | 改动 | 原因 | spec 编号 |
|---|---|---|---|
| `README.md` | 顶部插入修改版说明（链接上游、协议、本文件），其余内容不动 | 标明这是修改版（AGPLv3 §7(c)） | §4.1、§6 |
| `.github/workflows/docker-build.yml`、`docker-image-branch.yml`、`release.yml`、`electron-build.yml`、`sync-release-to-gitcode.yml` | 删除 | 它们推送上游的 Docker Hub 镜像、发布 Release、同步 GitCode，在 fork 里没有意义；删除是最小的禁用方式 | §4.4 |
| `.github/workflows/image.yml` | 新增：push tag `v*-77api.*` 时把 tag 写入 `VERSION`，用自带 Dockerfile 构建 `linux/amd64`，推送到 `ghcr.io/brodyrichardson918/77api-core:<tag>` 与 `:latest` | 我们自己的镜像发布渠道 | §4.4 |
| `relaykit/types/error.go`、`service/error.go`、`middleware/utils.go`、`controller/billing.go`、`controller/relay.go`、`controller/plugin_protocol.go`、`controller/plugin_protocol_image.go`（及测试期望 `middleware/model_rate_limit_test.go`、`middleware/distributor_test.go`） | 错误类型 `new_api_error` 改为 `77api_error`：常量 `ErrorTypeNewAPIError` 只改值不改名，其余字面量改为引用该常量 | 客户在错误体里看到的类型字符串不再是上游名字 | C1 |
| `main.go`、`middleware/recover.go` | panic 响应类型 `new_api_panic` 改为 `77api_panic`，消息固定为「服务内部错误，请联系 77API 支持并提供 request id」，不再回显 panic 详情，也不再带上游 GitHub issue 链接（详情仍写服务端日志） | 避免把内部错误细节和上游链接暴露给客户 | C2 |
| `common/constants.go`、`service/http.go`（注释）、`controller/relay.go`、`middleware/cors.go`（及测试 `service/http_77api_test.go`、`middleware/cors_77api_test.go`、`controller/relay_task_plugin_test.go`） | 响应头 `X-Oneapi-Request-Id` 改为 `X-77api-Request-Id`（常量 `RequestIdKey` 只改值不拆分，它同时是 Gin 上下文键、上游 id 的捕获匹配值）；`X-New-Api-Other-Ratios` 改为 `X-77api-Other-Ratios`；`X-New-Api-Version` 不再输出（`Version()` 中间件保留为空操作以免改动 `main.go`） | 客户在响应头里看不到上游名字；带前缀的 id 头不与 OpenAI 等上游自己返回的 `x-request-id` 撞名，上游的头原样透传 | C3 |
| `service/auth_session.go`、`web/src/lib/session-hint.ts`（及文档 `docs/authentication.md`、`docs/openapi/api.json`，测试 `service/auth_77api_test.go`、`web/src/lib/__tests__/session-hint-77api.test.ts`） | Cookie `new_api_refresh` 改为 `77api_refresh`，`new_api_has_session` 改为 `77api_has_session`（控制台读取后者判断是否有会话，两边名字必须一致） | 浏览器里看不到上游名字的 Cookie | C4 |
| `service/auth_token.go`（及测试 `middleware/auth_test.go`、`service/auth_77api_test.go`） | 访问令牌 issuer `new-api` 改为 `77api`，audience `new-api-dashboard` 改为 `77api-dashboard`，HMAC 域分隔串 `new-api/auth/` 改为 `77api/auth/` | 令牌里不再带上游名字；新部署没有旧令牌，不需要兼容 | C5 |
| `controller/topup_stripe.go`（及测试 `controller/payment_77api_test.go`） | Stripe 充值的商户引用号前缀 `new-api-ref-` 改为 `77api-ref-`；把内联的 `fmt.Sprintf` 抽成同文件的 `stripeReference(userId)`（格式 `<前缀><uid>-<毫秒>-<4位随机>` 不变）。全仓库检查过：没有任何代码解析或匹配该前缀（对外只出现它的 SHA-1 `ref_...`），无需联动改动 | 支付记录里不再出现上游名字 | C6 |
| `controller/topup_waffo.go`（及测试 `controller/payment_77api_test.go`） | Waffo 商品信息的应用名回退值 `New API` 改为 `77API`（仅在系统名为空时生效） | 支付页不再显示上游名字 | C6b |
| `relay/channel/openai/adaptor.go`（及测试 `relay/channel/openai/adaptor_77api_test.go`） | OpenRouter 渠道的归因头：`HTTP-Referer` 默认值 `https://www.newapi.ai` 改为 `https://www.77port.uk`，`X-OpenRouter-Title` 默认值 `New API` 改为 `77API`（渠道自定义头仍优先） | 上游 OpenRouter 看到的是我们的身份 | C7 |
| `common/constants.go`、`web/src/lib/constants.ts`、`web/index.html`（及测试 `common/constants_77api_test.go`、`web/src/lib/__tests__/brand-defaults-77api.test.ts`） | 默认系统名 `New API` 改为 `77API`（Go `SystemName`、前端 `DEFAULT_SYSTEM_NAME`），`index.html` 的 `<title>` 与 `<meta name="title">` 同改，JS 加载前页面标题就是 77API | 管理员没设置系统名时，标题和品牌位不显示上游名字 | C8 |
| `setting/operation_setting/general_setting.go`、`web/src/features/home/components/sections/hero.tsx`（及测试 `setting/operation_setting/general_setting_77api_test.go`、`brand-defaults-77api.test.ts`） | 默认文档链接 `https://docs.newapi.pro` 改为 `https://www.77port.uk/docs`（后端 `DocsLink` 默认值与首页回退链接） | 首页「文档」按钮默认指向我们的文档 | C9 |
| `web/public/favicon.ico`、`web/public/logo.png` | 替换为 77API 标志：`favicon.ico` 内含 16/32/48 三个 PNG，`logo.png` 为 512×512 透明底；由 77API 仓库的 `scripts/render-core-icons.mjs` 用 `app/icon.svg` 渲染 | 管理员没设置 Logo 时，页面图标和后台 Logo 是我们的，不是上游的 | C10 |
| `web/src/features/system-update/use-system-update.ts`、`system-update-action.tsx`（测试改写 `web/src/features/system-update/__tests__/update-checking.test.tsx`） | 新增 `export const UPDATE_CHECK_ENABLED = false`：查询的 `enabled` 与 `shouldNotify` 都与它相与，入口组件在它为 false 时返回 `null`。系统设置里的维护区块（`update-checker-section.tsx`）只通过该入口组件取数，不需要单独改 | 管理后台不再请求 `api.github.com` 检查上游版本，也不会提示升到上游版本 | U1 |
