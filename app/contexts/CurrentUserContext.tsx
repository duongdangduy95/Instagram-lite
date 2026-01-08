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
  const data = (await res.json()) as { id?: string; fullname?: string | null; username?: string | null; image?: string | null }
  if (!data?.id) return null
  return {
    id: data.id,
    fullname: data.fullname ?? null,
    username: data.username ?? null,
    image: data.image ?? null,
  }
}

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const sessionUserId = session?.user?.id ?? null
  const sessionFullname = session?.user?.fullname ?? null
  const sessionUsername = session?.user?.username ?? null
  const sessionImage = (session?.user as { image?: string | null } | undefined)?.image ?? null

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

    // Ưu tiên session, nhưng nếu session chưa có image thì vẫn fetch /api/me/basic để lấy avatar
    const cachedImage = cachedUserId === sessionUserId ? cachedUser?.image : null

    const fromSession: NonNullable<CurrentUserSafe> = {
      id: sessionUserId,
      fullname: sessionFullname,
      username: sessionUsername,
      image: sessionImage ?? cachedImage ?? null,
    }

    // Set nhanh từ session để UI có dữ liệu ngay.
    // Nếu đã có image thì có thể return luôn; nếu chưa có image, sẽ tiếp tục fetch để bổ sung.
    if (fromSession.fullname || fromSession.username || fromSession.image) {
      cachedUserId = sessionUserId
      cachedUser = fromSession
      inFlight = null
      setUser(fromSession)
      if (fromSession.image) return
    }

    // Fallback: gọi /api/me/basic (dedupe)
    if (inFlight) {
      const u = await inFlight
      // Merge: ưu tiên fullname/username từ session (nếu có), ưu tiên image từ API
      const merged: CurrentUserSafe = u
        ? {
            id: u.id,
            fullname: fromSession.fullname ?? u.fullname ?? null,
            username: fromSession.username ?? u.username ?? null,
            image: u.image ?? fromSession.image ?? null,
          }
        : fromSession
      cachedUserId = sessionUserId
      cachedUser = merged
      setUser(merged)
      return
    }

    inFlight = fetchMeBasic()
    const u = await inFlight
    inFlight = null

    const merged: CurrentUserSafe = u
      ? {
          id: u.id,
          fullname: fromSession.fullname ?? u.fullname ?? null,
          username: fromSession.username ?? u.username ?? null,
          image: u.image ?? fromSession.image ?? null,
        }
      : fromSession

    cachedUserId = sessionUserId
    cachedUser = merged
    setUser(merged)
  }, [sessionUserId, sessionFullname, sessionUsername, sessionImage])

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

  // Realtime sync: khi user đổi profile (avatar/fullname/username) thì cập nhật ngay navbar
  useEffect(() => {
    const onProfileChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { userId: string; fullname?: string | null; username?: string | null; image?: string | null }
        | undefined
      if (!detail?.userId) return
      if (!sessionUserId || detail.userId !== sessionUserId) return

      setUser((prev) => {
        const base: NonNullable<CurrentUserSafe> = prev ?? { id: sessionUserId }
        const next: NonNullable<CurrentUserSafe> = {
          ...base,
          fullname: typeof detail.fullname !== 'undefined' ? detail.fullname : base.fullname ?? null,
          username: typeof detail.username !== 'undefined' ? detail.username : base.username ?? null,
          image: typeof detail.image !== 'undefined' ? detail.image : base.image ?? null,
        }
        cachedUserId = sessionUserId
        cachedUser = next
        return next
      })
    }

    window.addEventListener('user:profile-change', onProfileChange as EventListener)
    return () => window.removeEventListener('user:profile-change', onProfileChange as EventListener)
  }, [sessionUserId])

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


