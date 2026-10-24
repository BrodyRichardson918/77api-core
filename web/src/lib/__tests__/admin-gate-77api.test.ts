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

import { adminGateTarget } from '../admin-gate'
import { ROLE } from '../roles'

// Only administrators use the gateway UI; everyone else belongs in the
// 77API console at /console (same origin, outside this SPA).
describe('77API admin gate', () => {
  test('ordinary users are sent to the console', () => {
    expect(adminGateTarget(ROLE.USER)).toBe('/console')
  })

  test('an unknown role is sent to the console', () => {
    expect(adminGateTarget(undefined)).toBe('/console')
  })

  test('admins stay', () => {
    expect(adminGateTarget(ROLE.ADMIN)).toBeNull()
    expect(adminGateTarget(ROLE.SUPER_ADMIN)).toBeNull()
  })
})
