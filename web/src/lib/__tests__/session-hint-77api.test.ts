import { expect, it } from 'vitest'

import { SESSION_HINT_COOKIE_NAME } from '../session-hint'

// The 77API console and the server both rely on this exact name.
it('uses the 77api session hint cookie name', () => {
  expect(SESSION_HINT_COOKIE_NAME).toBe('77api_has_session')
})
