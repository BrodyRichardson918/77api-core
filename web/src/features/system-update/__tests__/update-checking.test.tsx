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
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
  type QueryClient,
} from '@tanstack/react-query'
import { cleanup, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { UpdateCheckerSection } from '@/features/system-settings/maintenance/update-checker-section'
import { api } from '@/lib/api'
import { createAppQueryClient } from '@/lib/query-client'
import { ROLE } from '@/lib/roles'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'

import { useSystemUpdatePreferencesStore, useSystemUpdateStore } from '../store'
import { SystemUpdateAction } from '../system-update-action'
import { UPDATE_CHECK_ENABLED, useSystemUpdate } from '../use-system-update'

// 77API Core: the upstream release check (api.github.com) is switched off
// for every role. These tests pin that: even an administrator, with the page
// visible and the browser online, never causes a request to GitHub.
const release = {
  tag_name: 'v1.0.0-rc.99',
  draft: false,
  prerelease: false,
  published_at: '2026-09-08T13:01:00Z',
  body: 'Release notes for administrators.',
}
const fetchMock = vi.fn<typeof fetch>()
let client: QueryClient

function Wrapper(props: { children: ReactNode }) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  useSystemUpdateStore.setState({ snapshot: null })
  useSystemUpdatePreferencesStore.setState({ ignoredVersionsByUserId: {} })
  useAuthStore
    .getState()
    .auth.setUser({ id: 1, username: 'admin', role: ROLE.ADMIN })
  focusManager.setFocused(true)
  onlineManager.setOnline(true)
  fetchMock.mockReset()
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify([release]), {
        headers: { 'Content-Type': 'application/json' },
      })
  )
  vi.stubGlobal('fetch', fetchMock)
  client = createAppQueryClient()
  client.setQueryData(STATUS_QUERY_KEY, { version: 'v1.0.0-rc.35' })
  vi.spyOn(api, 'get').mockResolvedValue({
    data: { success: true, data: { version: 'v1.0.0-rc.35' } },
  })
})

afterEach(() => {
  cleanup()
  client.clear()
  useSystemUpdateStore.setState({ snapshot: null })
  useSystemUpdatePreferencesStore.setState({ ignoredVersionsByUserId: {} })
  useAuthStore.getState().auth.reset()
  localStorage.clear()
  focusManager.setFocused(undefined)
  onlineManager.setOnline(true)
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('upstream update check is disabled', () => {
  test('the switch is off', () => {
    expect(UPDATE_CHECK_ENABLED).toBe(false)
  })

  test.each([ROLE.ADMIN, ROLE.SUPER_ADMIN])(
    'administrator role %s: no request to GitHub and no entry rendered',
    async (role) => {
      useAuthStore.getState().auth.setUser({ id: 1, username: 'admin', role })
      render(
        <>
          <SystemUpdateAction />
          <SystemUpdateAction presentation='version' />
          <SystemUpdateAction compact={false} />
        </>,
        { wrapper: Wrapper }
      )
      // Give any (wrongly) enabled query a chance to fire.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(fetchMock).not.toHaveBeenCalled()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    }
  )

  test('the maintenance section shows no update entry and makes no request', async () => {
    render(
      <UpdateCheckerSection
        currentVersion='v1.0.0-rc.35'
        startTime={1_700_000_000}
      />,
      { wrapper: Wrapper }
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('v1.0.0-rc.35')).toBeInTheDocument()
  })

  test('the hook never fetches or notifies, even with a newer release cached', async () => {
    useSystemUpdateStore.getState().setSnapshot({
      release,
      lastCheckedAt: 0,
      lastAttemptAt: 0,
      error: null,
    })
    const hook = renderHook(useSystemUpdate, { wrapper: Wrapper })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(hook.result.current.shouldNotify).toBe(false)
    expect(hook.result.current.checking).toBe(false)
  })
})
