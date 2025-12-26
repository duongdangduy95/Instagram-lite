'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { CurrentUserSafe } from '@/types/dto'

type CurrentUserStatus = 'loading' | 'authenticated' | 'unauthenticated'

type CurrentUserContextValue = {
  user: CurrentUserSafe
  status: CurrentUserStatus
  refresh: () => Promise<void>
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

// In-memory cache theo session userId để hạn chế gọi /api/me/basic
let cachedUserId: string | null = null
let cachedUser: CurrentUserSafe | null = null
let inFlight: Promise<CurrentUserSafe> | null = null

async function fetchMeBasic(): Promise<CurrentUserSafe> {
  const res = await fetch('/api/me/basic', { credentials: 'include' })
  if (!res.ok) return null
  const data = await res.json()
  if (!data?.id) return null
  return { id: data.id, fullname: data.fullname ?? null, username: data.username ?? null }
}

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const sessionUserId = session?.user?.id ?? null

  const [user, setUser] = useState<CurrentUserSafe>(null)

  const status: CurrentUserStatus =
    sessionStatus === 'loading'
      ? 'loading'
      : sessionStatus === 'authenticated'
        ? 'authenticated'
        : 'unauthenticated'

  const refresh = useCallback(async () => {
    if (!sessionUserId) {
      cachedUserId = null
      cachedUser = null
      inFlight = null
      setUser(null)
      return
    }

    // Ưu tiên session (không cần gọi API)
    const fromSession: CurrentUserSafe = {
      id: sessionUserId,
      fullname: session?.user?.fullname ?? null,
      username: session?.user?.username ?? null,
    }

    if (fromSession.fullname || fromSession.username) {
      cachedUserId = sessionUserId
      cachedUser = fromSession
      inFlight = null
      setUser(fromSession)
      return
    }

    // Fallback: gọi /api/me/basic (dedupe)
    if (inFlight) {
      const u = await inFlight
      setUser(u)
      return
    }

    inFlight = fetchMeBasic()
    const u = await inFlight
    inFlight = null

    cachedUserId = sessionUserId
    cachedUser = u
    setUser(u)
  }, [sessionUserId, session?.user?.fullname, session?.user?.username])

  useEffect(() => {
    if (status === 'unauthenticated') {
      cachedUserId = null
      cachedUser = null
      inFlight = null
      setUser(null)
      return
    }

    if (status === 'loading') return
    if (!sessionUserId) return

    // Cache hit
    if (cachedUserId === sessionUserId && cachedUser) {
      setUser(cachedUser)
      return
    }

    void refresh()
  }, [status, sessionUserId, refresh])

  const value = useMemo<CurrentUserContextValue>(
    () => ({ user, status, refresh }),
    [user, status, refresh]
  )

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider')
  }
  return ctx
}


