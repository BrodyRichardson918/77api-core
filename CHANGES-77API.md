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
