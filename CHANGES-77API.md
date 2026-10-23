# CHANGES-77API

本仓库是 new-api（https://github.com/QuantumNous/new-api）的修改版本，用于 77API 平台；协议 AGPL-3.0（见 [LICENSE](LICENSE)、[NOTICE](NOTICE)）。按 AGPLv3 §7(c) 在此列出全部改动。

上游基线：`v1.0.0-rc.46`（提交 `7d8b912`）。我们的版本号带 `-77api.<n>` 后缀，例如 `v1.0.0-rc.46-77api.1`。

| 文件 | 改动 | 原因 | spec 编号 |
|---|---|---|---|
| `README.md` | 顶部插入修改版说明（链接上游、协议、本文件），其余内容不动 | 标明这是修改版（AGPLv3 §7(c)） | §4.1、§6 |
| `.github/workflows/docker-build.yml`、`docker-image-branch.yml`、`release.yml`、`electron-build.yml`、`sync-release-to-gitcode.yml` | 删除 | 它们推送上游的 Docker Hub 镜像、发布 Release、同步 GitCode，在 fork 里没有意义；删除是最小的禁用方式 | §4.4 |
| `.github/workflows/image.yml` | 新增：push tag `v*-77api.*` 时把 tag 写入 `VERSION`，用自带 Dockerfile 构建 `linux/amd64`，推送到 `ghcr.io/brodyrichardson918/77api-core:<tag>` 与 `:latest` | 我们自己的镜像发布渠道 | §4.4 |
