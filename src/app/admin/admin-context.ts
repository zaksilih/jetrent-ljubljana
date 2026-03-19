'use client'

import { createContext, useContext } from 'react'

export interface AdminCtx {
  userEmail: string | null
  signOut: () => Promise<void>
}

export const AdminContext = createContext<AdminCtx>({
  userEmail: null,
  signOut: async () => {},
})

export function useAdmin() {
  return useContext(AdminContext)
}
