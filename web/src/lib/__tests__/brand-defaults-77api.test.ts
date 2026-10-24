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
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, test } from 'vitest'

import { DEFAULT_LOGO, DEFAULT_SYSTEM_NAME } from '../constants'

describe('77API brand defaults', () => {
  test('default system name is 77API', () => {
    expect(DEFAULT_SYSTEM_NAME).toBe('77API')
    expect(DEFAULT_LOGO).toBe('/logo.png')
  })

  test('index.html sets the title and meta title before any JS runs', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8')
    expect(html).toContain('<title>77API</title>')
    expect(html).toContain('<meta name="title" content="77API" />')
    expect(html).not.toContain('New API')
  })

  test('hero falls back to the 77API docs link', () => {
    const hero = readFileSync(
      resolve(__dirname, '../../features/home/components/sections/hero.tsx'),
      'utf8'
    )
    expect(hero).toContain("'https://www.77port.uk/docs'")
    expect(hero).not.toContain('docs.newapi.pro')
  })
})
