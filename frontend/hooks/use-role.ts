"use client"

import { useState, createContext, useContext, createElement } from "react"
import type { ReactNode } from "react"
import type { DashboardRole } from "@/types"

interface RoleContextValue {
  role: DashboardRole
  setRole: (role: DashboardRole) => void
}

const Ctx = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DashboardRole>("collector")

  return createElement(Ctx.Provider, { value: { role, setRole } }, children)
}

export function useRole() {
  const context = useContext(Ctx)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
