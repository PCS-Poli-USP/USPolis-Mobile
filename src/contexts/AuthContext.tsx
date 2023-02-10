import { User } from '@/dtos'
import { userStorage } from '@/storage/user'
import { useEffect } from 'react'
import { createContext, useState } from 'react'

type SignInData = {
  name: string
}

export type AuthContextDataProps = {
  user: User | null
  handleSignIn: (signInData: SignInData) => void
  handleLogout: () => void
  isLoadingStorageUser: boolean
}

type AuthContextProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: ''
  })
  const [isLoadingStorageUser, setIsLoadingStorageUser] = useState(true)

  const handleSignIn = (data: SignInData) => {
    if (data.name) {
      setUser({
        id: '1',
        name: data.name
      })
      userStorage.save({
        id: '1',
        name: data.name
      })
    }
  }

  const handleLogout = () => {
    setUser(null)
    userStorage.delete()
  }

  const loadUserData = async () => {
    try {
      // const user = await userStorage.get()
      // To remove user login page
      const tempDefaultUser = { id: '1', name: '' }
  
      setUser(tempDefaultUser)
    } catch (err) {
      throw err
    } finally {
      setIsLoadingStorageUser(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoadingStorageUser, user, handleSignIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
