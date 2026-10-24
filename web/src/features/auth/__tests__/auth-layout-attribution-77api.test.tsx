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

import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ProjectAttribution } from '@/components/layout/components/footer'

// 77API serves the gateway UI under /admin and sends / to /dashboard, so the
// home page footer (new-api's NOTICE attribution) is no longer reachable. The
// sign-in page every visitor of /admin sees carries the attribution instead.
describe('77API gateway UI keeps the new-api attribution visible', () => {
  test('the project attribution links to the upstream repository', () => {
    render(<ProjectAttribution currentYear={2026} />)
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/QuantumNous/new-api'
    )
  })

  test('the auth layout (sign-in page) renders the attribution', () => {
    const layout = readFileSync(
      resolve(__dirname, '../auth-layout.tsx'),
      'utf8'
    )
    expect(layout).toContain('<ProjectAttribution')
  })

  test('the index route sends / to the dashboard', () => {
    const index = readFileSync(
      resolve(__dirname, '../../../routes/index.tsx'),
      'utf8'
    )
    expect(index).toContain("redirect({ to: '/dashboard'")
  })
})
