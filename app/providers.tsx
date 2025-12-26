"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { CurrentUserProvider } from "@/app/contexts/CurrentUserContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrentUserProvider>{children}</CurrentUserProvider>
    </SessionProvider>
  )
}
