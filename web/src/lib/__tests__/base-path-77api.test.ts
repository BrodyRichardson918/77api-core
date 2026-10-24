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
import { describe, expect, test } from 'vitest'

import { BASE_PATH, withBase } from '../base-path'

// The gateway UI is served under /admin on the single 77API origin
// (Caddy strips the prefix before new-api sees the request).
describe('77API base path', () => {
  test('the UI lives under /admin', () => {
    expect(BASE_PATH).toBe('/admin')
  })

  test('withBase prefixes root-absolute paths', () => {
    expect(withBase('/logo.png')).toBe('/admin/logo.png')
  })

  test('withBase is idempotent on already-prefixed paths', () => {
    expect(withBase('/admin/x')).toBe('/admin/x')
    expect(withBase('/admin')).toBe('/admin')
    expect(withBase('/admin?x=1')).toBe('/admin?x=1')
  })

  test('withBase leaves absolute URLs alone', () => {
    expect(withBase('https://a.b/c')).toBe('https://a.b/c')
    expect(withBase('http://a.b/c')).toBe('http://a.b/c')
  })

  test('withBase does not treat a lookalike segment as the prefix', () => {
    expect(withBase('/administrator')).toBe('/admin/administrator')
  })
})
