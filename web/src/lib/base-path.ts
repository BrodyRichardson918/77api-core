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
/**
 * 77API: the gateway UI is served under /admin on the single public origin
 * (https://api.77port.uk). The reverse proxy strips the prefix, so the Go
 * server still serves web/dist at its own root, but the browser sees /admin/...
 *
 * Router targets (`to`, `redirect({ to })`, `<Link to>`) must NOT use
 * withBase: the router adds BASE_PATH itself. Use withBase only for URLs the
 * router does not handle: static files, raw <a href>, window.open/location.
 */
export const BASE_PATH = '/admin'

export function withBase(path: string): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//')) return path
  if (new RegExp(`^${BASE_PATH}(?=$|[/?#])`).test(path)) return path
  return `${BASE_PATH}${path.startsWith('/') ? '' : '/'}${path}`
}
