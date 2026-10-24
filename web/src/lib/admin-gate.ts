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
import { ROLE } from './roles'

/**
 * 77API: only administrators use the gateway UI. Everyone else is sent to the
 * 77API console, which lives on the same origin outside this SPA (so callers
 * must use a full page navigation, not the router).
 *
 * Returns the URL to leave for, or null when the user may stay.
 */
export function adminGateTarget(role: number | undefined): string | null {
  if (role === undefined || role < ROLE.ADMIN) return '/console'
  return null
}
