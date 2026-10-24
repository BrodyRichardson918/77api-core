/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { describe, expect, test } from 'vitest'

// 77API serves this UI under /admin on the single public origin, and the
// site root belongs to the 77API Next.js app. A root-absolute URL that leaves
// the router (window.open, location.*, raw <a href>/src) must go through
// withBase(), or it lands on the Next app instead of this SPA. Router targets
// (`to`, `redirect({ to })`) are not scanned: the router adds the basepath.

const SRC = resolve(__dirname, '../..')
// Root-absolute (one slash). Not the API, which stays at the site root, and
// not /console, the 77API console that full-page navigations target on purpose.
const ROOT_PATH = String.raw`['"\`]\/(?!\/|api\/|console(?:[/?#'"\`]))`
const CALL = String.raw`(?:window\.open|location\.(?:assign|replace))\(\s*`
const PATTERNS = [
  new RegExp(CALL + ROOT_PATH),
  new RegExp(String.raw`location\.href\s*=\s*` + ROOT_PATH),
  new RegExp(String.raw`\b(?:href|src)=\{?\s*` + ROOT_PATH),
]
// A variable passed to window.open / location.* that the same file assigns
// a root-absolute literal or template.
const CALL_WITH_IDENT = new RegExp(
  String.raw`(?:${CALL}|location\.href\s*=\s*)([A-Za-z_$][\w$]*)\s*[,)\n]`,
  'g'
)

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(path)
    }
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : []
  })
}

function findUnprefixed(): string[] {
  const hits: string[] = []
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, 'utf8')
    const name = relative(SRC, file)
    text.split('\n').forEach((line, index) => {
      if (PATTERNS.some((pattern) => pattern.test(line))) {
        hits.push(`${name}:${index + 1}: ${line.trim()}`)
      }
    })
    for (const match of text.matchAll(CALL_WITH_IDENT)) {
      const assigned = new RegExp(
        String.raw`\b(?:const|let|var)\s+${match[1]}\s*=\s*` + ROOT_PATH
      )
      if (assigned.test(text)) {
        const line = text.slice(0, match.index).split('\n').length
        hits.push(
          `${name}:${line}: ${match[0].trim()} (root-absolute variable)`
        )
      }
    }
  }
  return hits
}

describe('77API: URLs that bypass the router carry the /admin base path', () => {
  test('no root-absolute window.open / location.* / href / src outside withBase', () => {
    expect(findUnprefixed()).toEqual([])
  })
})
