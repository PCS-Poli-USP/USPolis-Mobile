import { GAuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

export function useGoogleAuthContext() {
  // uses the object that was created by createContext(), in this case GAuthContext
  const gAuthCtx = useContext(GAuthContext)

  // Type guard: makes sures it's not null!
  if (gAuthCtx == null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return gAuthCtx
}