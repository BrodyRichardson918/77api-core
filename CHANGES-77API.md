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
