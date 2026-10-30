import { createContext, useContext, useState, type ReactNode } from 'react'
import { adminLogin } from '../lib/api'

const STORAGE_KEY = 'belocar_admin_session_v1'

interface AdminSession {
  token: string
  username: string
  expiresAt: string
}

interface AdminAuthContextValue {
  session: AdminSession | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

function readInitialSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdminSession
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(readInitialSession)

  const login = async (username: string, password: string) => {
    const response = await adminLogin(username, password)
    const newSession: AdminSession = response
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
    setSession(newSession)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  return (
    <AdminAuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth debe usarse dentro de un AdminAuthProvider')
  }
  return context
}
