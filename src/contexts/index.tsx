import { AuthContextProvider } from "./AuthContext"

type ContextsProps = {
  children: React.ReactNode
}

export const Contexts = ({ children }: ContextsProps) => {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  )
}